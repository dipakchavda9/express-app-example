const util = require('../util');

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
            trn.trn_date,
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
        LEFT JOIN
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
            '${startDate}' and '${endDate}'
        AND
            trn_type = 'C';
    `);
    
    if (!transactions) {
        return false;
    }

    let formattedTrns = {};
    for (var i = 0; i < transactions.rows.length; i++) {
        if (!formattedTrns[transactions.rows[i].receipt_id]) {
            formattedTrns[transactions.rows[i].receipt_id] = [];
        }
        formattedTrns[transactions.rows[i].receipt_id].push(transactions.rows[i]);
    }

    return formattedTrns;
}

module.exports = {
    getDashboardData,
    getCreditTrnsByDateRange
};
