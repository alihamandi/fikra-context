import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import firebase from 'firebase';
import ReactModal from 'react-modal'

// Initialize Firebase
var config = {
    apiKey: "AIzaSyC37UgTY8oCPByIZI26hLQED5_vaFoxrIQ",
    authDomain: "fikrefirejobs.firebaseapp.com",
    databaseURL: "https://fikrefirejobs.firebaseio.com",
    projectId: "fikrefirejobs",
    storageBucket: "fikrefirejobs.appspot.com",
    messagingSenderId: "979378817458"
};
firebase.initializeApp(config);

//it adds data to the fire base database 
// firebase.firestore().collection('jobs').add({
//     title:"UI/UX",
//     comapny_name: "enjaz",
// })

let Context = React.createContext()


let Button = styled.button`
background-color: #466AB3;
  padding: 10px;
  border-radius: 8px;
  border: none;
  color: white;
  font-weight: bold;
  min-width: 100px;
`
let Navigation = styled.header`
background-color: #fff;
  height: 120px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10%;
`
let Container = styled.main`
  background-color: grey;
  min-height: 500px;
  padding: 10px 10%;
  
`
let Job = styled.div`
  height: 80px;
  border: 1px solid;
  background: #fff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: sans-serif;
  font-size: 2rem;
  margin-top: 20px;
`

let TextInput = styled.input`
  display:block;
  width:90%;
  margin:0 5% 0 5%;

`

class Header extends React.Component {

    constructor() {
        super()
        this.state = {

        }


    }

    render() {
        return (
            <Context.Consumer>
                {
                    (ctx) => {
                        return (
                            <Navigation>
                                <ReactModal isOpen={ctx.state.modalState} >
                                    <h1>
                                        hi there
                                    </h1>
                                    <TextInput type="text" placeholder="title" onChange={(event)=>{ctx.actions.onTitleChange(event.target.value)}} value={ctx.state.title}  />

                                    <TextInput type="text" placeholder="company name" onChange={(event)=>{ctx.actions.onCompanyNameChange(event.target.value)}} value={ctx.state.comapny_name}  />

                                    <Button onClick={() => {
                                        if (ctx.state.title!="" && ctx.state.comapny_name!="") {
                                            firebase.firestore().collection('jobs').add({
                                                title: ctx.state.title,
                                                comapny_name: ctx.state.comapny_name,
                                                date: Date.now()
    
                                            })
                                        }
                                        ctx.actions.toggle()

                                    }}>save</Button>

                                </ReactModal>
                                <img height="100px" src={require('./assets/logo.png')} />
                                <Button onClick={(/*that means its a function that i want to put in the param for this event /a call bacl/*/) => {
                                    ctx.actions.toggle()
                                }}>Post a job</Button>
                            </Navigation>)
                    }
                }
            </Context.Consumer>

        )
    }
}



class JobsList extends React.Component {
    constructor() {
        super()
    }

    render() {
        return (
            <Context.Consumer>
                {(ctx) => {
                    return (
                        <Container>
                            {
                                ctx.state.jobs.map((item, i) => {
                                    return (
                                        <Job key={i}>{item.comapny_name} , {item.title}</Job>
                                    )
                                })
                            }
                        </Container>
                    )
                }}
            </Context.Consumer>
        )
    }
}



class App extends React.Component {

    constructor() {
        super()
        this.state = {
            jobs: [],
            title: "",
            comapny_name: "",
            modalState: false,
            date: ''
        }

        firebase.firestore().collection('jobs').orderBy('date', 'asc').onSnapshot((snapshot) => {
            //.orederBy is to order the data uding the object i want (here date) and asc (ascending) desc(descending)
            //the ordering could be by title alphabetically
            //يعني شكل الداتا بيز بهاي اللحطة
            let jobs = [];
            snapshot.forEach((item) => {
                //means that make a loop around all objects one by one
                jobs.push(item.data())
                this.setState({
                    jobs: jobs,
                })
            })
        })
    }

    render() {
        return (
            <Context.Provider value={{
                //the value is the state of the provider of all project
                state: this.state, actions: {
                    //actions means that the thing that i want to do for the max-parent state
                    // addJob: () => {
                    //     firebase.firestore().collection('jobs').add({
                    //         title: 'any',
                    //         company: 'any',
                            
                    //     })

                    //     let jobs = this.state.jobs
                    //     jobs.push({})

                    //     this.setState({ jobs: jobs })
                    // },
                    toggle: () => {
                        this.setState({
                            modalState: !this.state.modalState
                        })
                    },
                    onTitleChange: (value)=>{
                        this.setState({
                            title: value,
                        })
                    },
                    onCompanyNameChange: (value)=>{
                        this.setState({
                            comapny_name: value,
                        })
                    }
                }
            }}>
                <Header />
                <JobsList />
            </Context.Provider>


        )
    }
}







ReactDOM.render(<App />, document.getElementById('root'))