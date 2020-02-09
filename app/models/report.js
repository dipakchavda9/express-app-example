const util = require('../util');

const getDashboardData = async (db) => {
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
            date_part('year', trn_date) = date_part('year', current_date)
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

    var currentFY = util.getFinancialYear();
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

module.exports = {
    getDashboardData
};
