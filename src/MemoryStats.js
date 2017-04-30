import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
import './styles/MemoryStats.css'

class MemoryStats extends Component {
    constructor(props) {
        super(props);
        this.chart = undefined
    }

    shouldComponentUpdate(nextProps) {
        const {memoryData} = this.props
        return (memoryData !== nextProps.memoryData)
    }

    parseMemoryGraphData(graphData) {
        let tempArr = []
        graphData.forEach(function(val) {
            let tempObj = {}
            tempObj['name'] = val.current_page
            tempObj['y'] = Math.ceil(val.sum/100000)
            tempArr.push(tempObj)    
        });
        return tempArr
    }

    renderGraph() {
        let graphData = this.props.memoryData
        let result = this.parseMemoryGraphData(graphData)    
        let titleName = (this.props.selectedPage === 'pageData') ? 'All Pages' : this.props.selectedPage
        let config = {
                chart: {
                    width: '700',
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Memory Usage by '+ titleName 
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    name: 'Memory',
                    colorByPoint: true,
                    data: result
                }]
            }
            return(<ReactHighcharts config={config} ref='chart'></ReactHighcharts>)
    }

    componentWillUnmount() {
        this.refs.chart.destroy();
    }

    render() {
        return (
            <div className='memoryStats'>
                {this.renderGraph()}
            </div>
        )
    }
}

export default MemoryStats;
