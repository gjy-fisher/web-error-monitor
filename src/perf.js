import report from './report'

const Perf = {
    init() {
        const perf = window && window.performance
        if (perf && perf.timing) {
            const data = {
                colNum: '',
                msg: 'performance',
                stack: '',
                lineNum: '',
                ext: {
                    performance: {
                        timing: perf.timing
                    }
                },
                level: 5
            }
            report.submit({ isNowSubmit: true, log: data })
        }
    }
}   

export default Perf
