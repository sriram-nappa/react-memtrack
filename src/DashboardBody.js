import React, { Component } from 'react';
import {ButtonGroup, Button} from 'react-bootstrap'
import './styles/DashboardBody.css'
import axios from 'axios'
import CrashStats from './CrashStats'
import MemoryStats from './MemoryStats'
import CrashTimeline from './CrashTimeline'

class DashboardBody extends Component {
    constructor(props) {
      super(props);
      this.state = {
        distinctVal: "distinctPages",
        buttonValue: "pageData", 
        data: [],
        pageNames:[],
        overallData: [],
        totalMemory: [],
        crashData: [],
        crashCount: [],
        toggleState: 0,
        listVal: '',
        callbackUpdate: false
      };
      this.loadPagedataFromServer = this.loadPagedataFromServer.bind(this);
      this.loadOverallPageDataFromServer = this.loadOverallPageDataFromServer.bind(this);
      this.handleListItem = this.handleListItem.bind(this);
    }

    componentWillMount() {
      this.loadOverallPageDataFromServer('pageData')
      this.loadTotalMemoryFromServer()
      this.loadPagesCrashReport('getDate')
    }
    componentDidMount() {
      this.loadDistinctPagesFromServer()
    }

    loadDistinctPagesFromServer() {
        let listContent = 'distinctPages';
        axios.get(`${this.props.url}/${listContent}`)
        .then(res => {
            this.setState({
                pageNames: res.data
            })
        })
    }

    loadPagedataFromServer(urlExt) {
      let newURL = (urlExt.indexOf('pageData') >= 0 || urlExt.indexOf('distinct') >= 0 ? `/${urlExt}` : `pageData/${urlExt.split('/').join('*')}`)
      axios.get(`${this.props.url}${newURL}`)
        .then(res => {
          this.setState({buttonValue: urlExt, overallData: res.data})
        })
    }

    loadOverallPageDataFromServer(val) {
        let listContent = val;
        axios.get(`${this.props.url}/${listContent}`)
        .then(res => {
            this.setState({
                overallData: res.data
            })
        })
    }

    loadTotalMemoryFromServer() {
      let listContent = 'totalMemory';
        axios.get(`${this.props.url}/${listContent}`)
        .then(res => {
            this.setState({
                totalMemory: res.data
            })
        })
    }

    loadPagesCrashTime() {
      let listContent = 'pageCrashTime';
        axios.get(`${this.props.url}/${listContent}`)
        .then(res => {
            this.setState({
                crashData: res.data
            })
        })
    }

    loadPagesCrashReport(urlExt) {
      let content = (urlExt.indexOf('getDate') >= 0 || urlExt.indexOf('pageData') >=0 ? `/getDate` : `getDate/${urlExt.split('/').join('*')}`)
       axios.get(`${this.props.url}${content}`)
        .then(res => {
            this.setState({
                crashCount: res.data
            })
        })
    }

    handleListItem(e) {
      let listVal = e.target.value;
      this.loadPagedataFromServer(listVal)
      this.loadPagesCrashReport(listVal)
    }

    renderDropdown() {
      let {pageNames} = this.state
      return (
         <ButtonGroup onClick={this.handleListItem}>
           <Button key={1} value='pageData'>All Pages</Button>
           {
              pageNames.map((currPage, index) => {
                  return (
                    <Button key={index+2} value={currPage.current_page}>{currPage.current_page}</Button>
                  )
              })
            }
          </ButtonGroup>
      )
    }

    render() {
      return (
        <div className='dashContainer'>
          {this.renderDropdown()}
          <CrashStats url={this.props.url} selectedPage={this.state.buttonValue} listVal={this.state.listVal} overallData={this.state.overallData}/>
          <MemoryStats selectedPage={this.state.buttonValue} memoryData={this.state.totalMemory}/>
          <CrashTimeline selectedPage={this.state.buttonValue} crashCount={this.state.crashCount} />
        </div>
      )
    }
}

export default DashboardBody;