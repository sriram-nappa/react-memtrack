import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';

class CrashTimeline extends Component {
    constructor(props) {
        super(props);
        this.chart = undefined
    }

    shouldComponentUpdate(nextProps) {
        const {crashCount, selectedPage} = this.props
        return (crashCount !== nextProps.crashCount || selectedPage !== nextProps.selectedPage)
    }

    parseCrashTimelineData(graphData) {
        let tempArr = []
        let tempArrTrue = []
        let tempArrFalse = []
        let currPage = this.props.selectedPage
        graphData.forEach(function(val) {
            let tmpArr = []
            if(currPage!=='pageData') {            
                if(val.current_page === currPage) {
                    tmpArr.push(val.hour)
                    tmpArr.push(parseInt(val.count))
                        if(val.did_aww_snap)
                            tempArrTrue.push(tmpArr)
                        else
                            tempArrFalse.push(tmpArr)
                }
            }
            else {
                tmpArr.push(val.hour)
                tmpArr.push(parseInt(val.count))
                    if(val.did_aww_snap)
                        tempArrTrue.push(tmpArr)
                    else
                        tempArrFalse.push(tmpArr)
            }
        });
        tempArr.push(tempArrTrue)
        tempArr.push(tempArrFalse)
        return tempArr
    }

    renderGraph() {
        let graphData = this.props.crashCount
        let result = this.parseCrashTimelineData(graphData)    
        // let titleName = (this.props.selectedPage === 'pageData') ? 'All Pages' : this.props.selectedPage
        let config = {
            chart: {
                type: 'scatter',
                zoomType: 'xy',
                width: '600',
                align: 'right'
            },
            title: {
                text: 'Hour versus Crash Count of each page'
            },
            xAxis: {
                title: {
                    enabled: true,
                    text: 'Hour'
                },
                startOnTick: true,
                endOnTick: true,
                showLastLabel: true
            },
            yAxis: {
                title: {
                    text: 'Crash Count'
                }
            },
            legend: {
                layout: 'horizontal',
                align: 'left',
                verticalAlign: 'top',
                x: 100,
                y: 50,
                floating: true,
                backgroundColor: '#FFFFFF',
                borderWidth: 1
            },
            plotOptions: {
                scatter: {
                    marker: {
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br>',
                        pointFormat: '{point.x} hrs, {point.y} times'
                    }
                }
            },
            series: [{
                name: 'True',
                color: 'rgba(223, 83, 83, .5)',
                data: result[0]

            }, {
                name: 'False',
                color: 'rgba(119, 152, 191, .5)',
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
            <div className='crashTimeline'>
                {this.renderGraph()}
            </div>
        )
    }
}

export default CrashTimeline;
