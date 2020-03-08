const util = require('../util');
const moment = require('moment');

const getDashboardData = async (db) => {
    var currentFY = util.getFinancialYear();

    let todayIncomeExpense = await db.raw(`
        select
            trn_type, sum(amount)
        from
            "Account".transactions
        where
            DATE(trn_date) = current_date
        group by
            trn_type`);
    let todaysIncome, todaysExpense;

    for (var i = 0; i< todayIncomeExpense.rows.length; i++) {
        if (todayIncomeExpense.rows[i].trn_type === 'C') {
            todaysIncome = +todayIncomeExpense.rows[i].sum;
        }
        if (todayIncomeExpense.rows[i].trn_type === 'D') {
            todaysExpense = +todayIncomeExpense.rows[i].sum;
        }
    }

    let monthlyIncomeExpense = await db.raw(`
        select
            to_char(to_timestamp(date_part('month', trn_date)::text, 'MM'), 'Month') as month_name,
            date_part('month', trn_date) as month,
            trn_type,
            sum(amount) as total_amount
        from
            "Account".transactions
        where
            financial_year = '${currentFY}'
        group by
            date_part('month', trn_date), trn_type
    `);

    let monthlyIncome = [], monthlyExpense = [];

    for (var i = 0; i < monthlyIncomeExpense.rows.length; i++) {
        monthlyIncomeExpense.rows[i].month_name = monthlyIncomeExpense.rows[i].month_name.trim();
        if (monthlyIncomeExpense.rows[i].trn_type === 'C') {
            monthlyIncome.push(monthlyIncomeExpense.rows[i]);
        }
        if (monthlyIncomeExpense.rows[i].trn_type === 'D') {
            monthlyExpense.push(monthlyIncomeExpense.rows[i]);
        }
    }

    let headWiseAmount = await db.raw(`
        select 
            c.name as head_name, c.transaction_type, sum(a.amount) as total_amount
        from 
            "Account".transactions as a
        inner join 
            "Account".sub_head_master as b on a.sub_head_id = b.id
        inner join 
            "Account".head_master as c on b.head_id=c.id
        where
            a.financial_year = '${currentFY}'
        group by 
            c.name, c.transaction_type;
    `);

    return {
        todaysIncome,
        todaysExpense,
        monthlyIncome,
        monthlyExpense,
        'head_wise_amount': headWiseAmount.rows
    };
}

const getCreditTrnsByDateRange = async (db, startDate, endDate) => {
    startDate += ' 00:00:00';
    endDate += ' 23:59:59';
    let transactions = await db.raw(`
        SELECT 
            trn.id as transaction_id,
            trn.haribhakt_id,
            trn.description,
            trn.trn_type,
            trn.amount,
            trn.financial_year,
            trn.receipt_id,
            trn.user_id,
            trn_date,
            hr.firstname,
            hr.lastname,
            hr.village_current,
            vc.name as village_current_name,
            hr.village_native,
            vn.name as village_native_name,
            hr.mobile1,
            hr.mobile2,
            hr.email,
            trn.sub_head_id,
            shm.name as sub_head_name,
            shm.head_id,
            hm.name as head_name
        FROM
            "Account".transactions trn
        INNER JOIN
            "Account".haribhakt hr
        ON
            trn.haribhakt_id = hr.id
        INNER JOIN
            "Account".sub_head_master shm
        ON
            trn.sub_head_id = shm.id
        INNER JOIN
            "Account".head_master hm
        ON
            shm.head_id = hm.id
        LEFT JOIN
            "Account".villages vc
        ON
            hr.village_current = vc.id
        LEFT JOIN
            "Account".villages vn
        ON
            hr.village_native = vn.id
        WHERE
            trn_date
        BETWEEN
            '${startDate}' AND '${endDate}'
        AND
            trn_type = 'C'
        AND
            receipt_id is not null
        ORDER BY
            trn_date;
    `);
    
    if (!transactions) {
        return false;
    }

    transactions = transactions.rows;

    let dateWiseTrns = {};
    for (var i =0; i < transactions.length; i++) {
        var trnDate = moment(transactions[i].trn_date, moment.ISO_8601).format('DD-MM-YYYY');
        if (!dateWiseTrns[trnDate]) {
            dateWiseTrns[trnDate] = [];
        }
        dateWiseTrns[trnDate].push(transactions[i]);
    }

    let dateReceiptWiseTrns = {};
    for (var trnDate in dateWiseTrns) {
        var transactionsByDate = dateWiseTrns[trnDate];
        var trnByReceipt = {};
        for (var j =0; j < transactionsByDate.length; j++) {
            if (!trnByReceipt[transactionsByDate[j].receipt_id]) {
                trnByReceipt[transactionsByDate[j].receipt_id] = [];
            }
            trnByReceipt[transactionsByDate[j].receipt_id].push(transactionsByDate[j]);
        }
        dateReceiptWiseTrns[trnDate] = trnByReceipt;
    }

    let formattedTrns = [];
    for (var trnDate in dateReceiptWiseTrns) {
        let dateWiseTrns = dateReceiptWiseTrns[trnDate];
        let mouldedReceiptWiseTrns = [];
        for (var receiptId in dateWiseTrns) {
            let receiptWiseTrns = dateWiseTrns[receiptId];
            let mappedReceiptWiseTrns = receiptWiseTrns.map((trn) => {
                return {
                    'sub_head_name': trn.sub_head_name,
                    'head_name': trn.head_name,
                    'amount': trn.amount
                }
            });
            let mouldedReceiptWiseTrn = {
                'firstname': receiptWiseTrns[0].firstname,
                'lastname': receiptWiseTrns[0].lastname,
                'receipt_id': receiptWiseTrns[0].receipt_id,
                'village_current_name': receiptWiseTrns[0].village_current_name,
                'transactions': mappedReceiptWiseTrns
            };
            mouldedReceiptWiseTrns.push(mouldedReceiptWiseTrn);
        }
        let formattedDateWiseTrns = {
            'date': trnDate,
            'data': mouldedReceiptWiseTrns
        };
        formattedTrns.push(formattedDateWiseTrns);
    }
    return formattedTrns;
}

const getRojmelData = async (db, date) => {
    let transactions = await db.raw(`
        SELECT 'C'      AS trn_type, 
            shm.name AS sub_head_name, 
            ''       AS description,
            0 AS voucher_id,
            Sum (t.amount) AS amount
        FROM   "Account".transactions t 
            INNER JOIN "Account".sub_head_master shm 
                    ON t.sub_head_id = shm.id 
        WHERE  t.haribhakt_id IS NOT NULL 
            AND t.trn_type = 'C'
            AND t.trn_date::date = '${date}'
        GROUP  BY sub_head_name 
        UNION 
        SELECT 'C'      AS trn_type, 
            shm.name AS sub_head_name, 
            t.description,
            0 AS voucher_id,
            t.amount 
        FROM   "Account".transactions t 
            INNER JOIN "Account".sub_head_master shm 
                    ON t.sub_head_id = shm.id 
        WHERE  t.haribhakt_id IS NULL 
            AND t.trn_type = 'C'
            AND t.trn_date::date = '${date}'
        UNION 
        SELECT 'D'      AS trn_type, 
            shm.name AS sub_head_name, 
            t.description,
            t.voucher_id,
            t.amount 
        FROM   "Account".transactions t 
            INNER JOIN "Account".sub_head_master shm 
                    ON t.sub_head_id = shm.id 
        WHERE  t.trn_type = 'D'
            AND t.trn_date::date = '${date}'
    `);

    let data = transactions.rows;
    let formattedData = {};

    formattedData.income = data.filter(trn => trn.trn_type === 'C').map((trn) => {
        delete trn.trn_type;
        trn.voucher_id = null;
        return trn;
    });
    formattedData.expense = data.filter(trn => trn.trn_type === 'D').map((trn) => {
        delete trn.trn_type;
        return trn;
    });

    let OCRecord = await db('opening_closing_balance').withSchema('Account').select('*').where({ 'date': date });
    if (OCRecord && OCRecord.length > 0) {
        formattedData.openingBalance = OCRecord[0].opening_balance;
        formattedData.closingBalance = OCRecord[0].closing_balance;
    }

    return formattedData;
};

module.exports = {
    getDashboardData,
    getCreditTrnsByDateRange,
    getRojmelData
};
