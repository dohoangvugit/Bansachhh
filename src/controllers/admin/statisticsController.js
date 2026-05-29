const supabase = require('../../config/db')

const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

const formatPeriodKey = (range, date) => {
    const d = new Date(date)
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const year = d.getFullYear()

    if (range === 'week') {
        return `${getWeekNumber(d)}-${year}`
    }

    if (range === 'month') {
        return `${month}-${year}`
    }

    if (range === 'year') {
        return `${year}`
    }

    return `${day}-${month}-${year}`
}

const formatPeriodLabel = (range, date) => {
    const d = new Date(date)
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const year = d.getFullYear()

    if (range === 'week') {
        return `Tuần ${getWeekNumber(d)}/${year}`
    }

    if (range === 'month') {
        return `${month}/${year}`
    }

    if (range === 'year') {
        return `${year}`
    }

    return `${day}/${month}`
}

const buildPeriods = (range) => {
    const now = new Date()
    const periods = []

    if (range === 'week') {
        const currentWeekStart = new Date(now)
        const day = currentWeekStart.getDay()
        const offset = day === 0 ? 6 : day - 1
        currentWeekStart.setDate(currentWeekStart.getDate() - offset)
        currentWeekStart.setHours(0, 0, 0, 0)

        for (let i = 7; i >= 0; i -= 1) {
            const d = new Date(currentWeekStart)
            d.setDate(d.getDate() - i * 7)
            const key = formatPeriodKey(range, d)
            periods.push({ key, label: formatPeriodLabel(range, d) })
        }
        return periods
    }

    if (range === 'month') {
        for (let i = 11; i >= 0; i -= 1) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const key = formatPeriodKey(range, d)
            periods.push({ key, label: formatPeriodLabel(range, d) })
        }
        return periods
    }

    if (range === 'year') {
        for (let i = 4; i >= 0; i -= 1) {
            const d = new Date(now.getFullYear() - i, 0, 1)
            const key = formatPeriodKey(range, d)
            periods.push({ key, label: formatPeriodLabel(range, d) })
        }
        return periods
    }

    for (let i = 6; i >= 0; i -= 1) {
        const d = new Date(now)
        d.setDate(d.getDate() - i)
        const key = formatPeriodKey(range, d)
        periods.push({ key, label: formatPeriodLabel(range, d) })
    }

    return periods
}

const statisticsController = {
    getBestSeller: async (req, res) => {
        try {
            const { data: orderItems, error } = await supabase
                .from('order_items')
                .select('book_id, quantity, books(title)')

            if (error) {
                console.error('Lỗi lấy order_items:', error)
                return res.status(500).send('Lỗi server')
            }

            const salesByBook = orderItems.reduce((acc, item) => {
                const bookId = item.book_id
                const title = item.books?.title || 'Không xác định'
                const quantity = Number(item.quantity) || 0

                if (!acc[bookId]) {
                    acc[bookId] = {
                        title,
                        quantity: 0
                    }
                }

                acc[bookId].quantity += quantity
                return acc
            }, {})

            const bestSellers = Object.values(salesByBook)
                .sort((a, b) => b.quantity - a.quantity)
                .slice(0, 10)

            return res.render('admin/bestseller', {
                layout: 'admin',
                bestSellers,
                labels: bestSellers.map((item) => item.title),
                values: bestSellers.map((item) => item.quantity)
            })
        } catch (error) {
            console.error('Get bestseller error:', error)
            return res.status(500).send('Lỗi server')
        }
    },

    getRevenue: async (req, res) => {
        try {
            return res.render('admin/revenue', {
                layout: 'admin'
            })
        } catch (error) {
            console.error('Get revenue error:', error)
            return res.status(500).send('Lỗi server')
        }
    },

    getRevenueData: async (req, res) => {
        try {
            const range = ['day', 'week', 'month', 'year'].includes(req.query.range)
                ? req.query.range
                : 'day'

            const periods = buildPeriods(range)
            const filterStart = new Date()
            if (range === 'day') {
                filterStart.setDate(filterStart.getDate() - 6)
            } else if (range === 'week') {
                filterStart.setDate(filterStart.getDate() - 7 * 7)
            } else if (range === 'month') {
                filterStart.setMonth(filterStart.getMonth() - 11)
            } else if (range === 'year') {
                filterStart.setFullYear(filterStart.getFullYear() - 4)
            }

            const { data: orders, error } = await supabase
                .from('orders')
                .select('created_at, total_price')
                .gte('created_at', filterStart.toISOString())

            if (error) {
                console.error('Lỗi lấy đơn hàng:', error)
                return res.status(500).send('Lỗi server')
            }

            const revenueMap = periods.reduce((acc, period) => {
                acc[period.key] = 0
                return acc
            }, {})

            let totalRevenue = 0
            let totalOrders = 0

            ;(orders || []).forEach((order) => {
                const orderDate = new Date(order.created_at)
                const orderKey = formatPeriodKey(range, orderDate)
                if (revenueMap[orderKey] !== undefined) {
                    revenueMap[orderKey] += Number(order.total_price) || 0
                    totalOrders += 1
                    totalRevenue += Number(order.total_price) || 0
                }
            })

            return res.json({
                range,
                labels: periods.map((period) => period.label),
                values: periods.map((period) => revenueMap[period.key] || 0),
                totalRevenue,
                totalOrders
            })
        } catch (error) {
            console.error('Get revenue data error:', error)
            return res.status(500).send('Lỗi server')
        }
    }
}

module.exports = statisticsController
