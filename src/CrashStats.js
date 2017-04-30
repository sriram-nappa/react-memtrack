import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';

class CrashStats extends Component {
    constructor(props) {
        super(props);
        this.chart = undefined
        this.state = {
            data: [],
            overallData: []
        }
    }

    shouldComponentUpdate(nextProps) {
        const {overallData} = this.props
        return (overallData !== nextProps.overallData)
    }

    parseCrashGraphData(graphData) {
        let resArr = []
        let tempArrPos = []
        let tempArrNeg = []
        graphData.forEach(function(val){
            let o=[]
            o.push(parseInt(val.timestamp)*1000)
            o.push(Math.ceil(val.bytes_used/100000))
            if(val.did_aww_snap)
                tempArrPos.push(o)
            else
                tempArrNeg.push(o)

        })
        resArr.push(tempArrPos.sort(function(a,b){
            return a[0]-b[0]
        }))
        resArr.push(tempArrNeg.sort(function(a,b){
            return a[0]-b[0]
        }))
        return resArr
    }

    renderGraph() {
        let graphData = this.props.overallData
        let result = this.parseCrashGraphData(graphData)    
        let titleName = (this.props.selectedPage === 'pageData') ? 'All Pages' : this.props.selectedPage
        let config = {
                chart: {
                    type: 'area',
                    zoomType: 'x'
                },
                title: {
                    text: 'Date versus memory used by '+ titleName
                },
                xAxis: {
                    type: 'datetime',
                    title: {
                        enabled: true,
                        text: 'Date/Time'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Memory used(mb)'
                    }
                },
                plotOptions: {
                   area: {
                        marker: {
                            radius: 2
                        },
                        lineWidth: 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                },
                series: [{
                    name: 'Page Crash: true',
                    color: 'rgba(255, 0, 0, 0.5)',
                    zIndex: 1,
                    data: result[0]
                }, {
                    name: 'Pages Crash: false',
                    color: 'rgba(0, 0, 0, 0.2)',
                    data: result[1]
                }]
            }
        if(result[0].length) {    
            return(<ReactHighcharts config={config} ref='chart'></ReactHighcharts>)
        } else {
            return null
        }
    }

    componentWillUnmount() {
        this.refs.chart.destroy();
    }

    render() {
        return (
            this.renderGraph()
        )
    }
}

export default CrashStats;
