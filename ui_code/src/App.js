import axios from 'axios';
import React, { useState,useEffect } from 'react';
import './App.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';




function App() {

    const [input, setInput] = useState('');
    const [confluenceOutput, setConfluenceOutput] = useState([]);
    const [stackOutput, setStackOutput] = useState([]);
    const [elasticOutput, setElasticOutput] = useState([]);
    const [title,setTitle]= useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPage1, setCurrentPage1] = useState(1);
    const [currentPage2, setCurrentPage2] = useState(1);
    const [blogsPerPage, setBlogsPerPage] = useState(10);
    const [blogsPerPage1, setBlogsPerPage1] = useState(10);
    const [blogsPerPage2, setBlogsPerPage2] = useState(10);
    const confluenceList=[[]];

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [startTime, setStartTime] = useState('00:00');
    const [endTime, setEndTime] = useState('23:59');
    const [data, setData] = useState([]);


    const s_year = startDate.getFullYear();
    const s_month = String(startDate.getMonth() + 1).padStart(2,'0'); // Add 1 to get the month number from 1 to 12
    const s_date = String(startDate.getDate()).padStart(2,'0');

    const startdateString = s_year + '-' + s_month + '-' + s_date;

    const e_year = endDate.getFullYear();
    const e_month = String(endDate.getMonth() + 1).padStart(2,'0'); // Add 1 to get the month number from 1 to 12
    const e_date = String(endDate.getDate()).padStart(2,'0');

    const enddateString = e_year + '-' + e_month + '-' + e_date;










    const handleSubmit = async (event) => {
    event.preventDefault();

    //confluence
    try {
    const response= await axios.get('http://localhost:8080/api/confluence' ,{
    params: {
    input: input
     }    }  );
     setConfluenceOutput(response.data);
     }    catch(error)  {
      console.error(error);    }

    //elasticsearch
      try {
        const elasticResponse= await axios.get('http://localhost:8080/api/elasticsearch' ,{
        params: {
        input: input,
        startdateString: startdateString,
        enddateString: enddateString,
        startTime: startTime,
        endTime: endTime
         }    }  );
         setElasticOutput(elasticResponse.data);
         }    catch(error)  {
          console.error(error);    }



    //Stackoverflow
        try {
        const stackResponse= await axios.get('http://localhost:8080/api/stackoverflow' ,{
        params: {
        input: input
         }    }  );
         setStackOutput(stackResponse.data);
         }    catch(error)  {
          console.error(error);    }
}




    const handleInputChange = (event) => {

      setInput(event.target.value);  }

     const confluenceLinkArray= [];
     const confluenceTitleArray=[];
     for (var i = 0; i < confluenceOutput.length; ++i) {
         if ( ( [i] % 2 ) === 0) {
          confluenceLinkArray.push(confluenceOutput[i]);
         }
         else {
           confluenceTitleArray.push(confluenceOutput[i]);
         }
       };

     const stackLinkArray= [];
     const stackTitleArray=[];
     for (var i = 0; i < stackOutput.length; ++i) {
         if ( ( [i] % 2 ) === 0) {
          stackLinkArray.push(stackOutput[i]);
         }
         else {
           stackTitleArray.push(stackOutput[i]);
         }
       };







       // Get current blogs for confluence
             const indexOfLastBlog = currentPage * blogsPerPage;
             const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
             const currentBlogs = confluenceLinkArray.slice(indexOfFirstBlog, indexOfLastBlog);
             const currentBlogs1 = confluenceTitleArray.slice(indexOfFirstBlog, indexOfLastBlog);


             // Get current blogs for elastic
             const indexOfLastBlog1 = currentPage1 * blogsPerPage1;
             const indexOfFirstBlog1 = indexOfLastBlog1 - blogsPerPage1;
             const currentBlogs2 = elasticOutput.slice(indexOfFirstBlog1, indexOfLastBlog1);

             //Get current blogs for Stackoverflow
             const indexOfLastBlog2 = currentPage2 * blogsPerPage2;
             const indexOfFirstBlog2 = indexOfLastBlog2 - blogsPerPage2;
             const currentBlogs3 = stackLinkArray.slice(indexOfFirstBlog2, indexOfLastBlog2);
             const currentBlogs4 = stackTitleArray.slice(indexOfFirstBlog2, indexOfLastBlog2);

             // Change page
               const paginate = (pageNumber) => setCurrentPage(pageNumber);
               const paginate1 = (pageNumber1) => setCurrentPage1(pageNumber1);
               const paginate2 = (pageNumber2) => setCurrentPage2(pageNumber2);

               // Render pagination links
               //pagination for confluence
               const pageNumbers = [];
               for (let i = 1; i <= Math.ceil(confluenceTitleArray.length / blogsPerPage); i++) {
                 pageNumbers.push(i);
               }

               const renderPageNumbers = pageNumbers.map((number) => {
                 return (
                   <p className="Page" key={number}>
                     <button onClick={() => paginate(number)}>{number}</button>
                   </p>
                 );
               });

                // pagination for elastic
              const pageNumbers1 = [];
               for (let i = 1; i <= Math.ceil(elasticOutput.length / blogsPerPage1); i++) {
                 pageNumbers1.push(i);
               }
                 const renderPageNumbers1 = pageNumbers1.map((number1) => {
                   return (
                    <p className="Page" key={number1}>
                         <button onClick={() => paginate1(number1)}>{number1}</button>
                    </p>
                );
                      });

                // pagination for stackoverflow results
              const pageNumbers2 = [];
               for (let i = 1; i <= Math.ceil(stackTitleArray.length / blogsPerPage2); i++) {
                 pageNumbers2.push(i);
               }


                const renderPageNumbers2 = pageNumbers2.map((number2) => {
                                return (
                                  <p className="Page" key={number2}>
                                    <button onClick={() => paginate2(number2)}>{number2}</button>
                                  </p>
                                );
                              });




         return (
         <div className="container" >
           <div className="App">
              <header className="App-header">
                 <form onSubmit={handleSubmit}>
                     <div style={{ display: 'flex'}} >
                      Keyword:<span></span>
                      <div><input className="searchBar input" type="text" value={input} onChange={handleInputChange} /></div>
                      <button type="submit"  onSubmit={handleSubmit}> Search </button>

                       <div>
                                           <label>Start Date:</label>
                                           <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
                                           <br />
                                           <label>End Date:</label>
                                           <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
                                           <br />
                                           <label>Start Time:</label>
                                           <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                                           <br />
                                           <label>End Time:</label>
                                           <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                                           <br />

                      </div>




                     </div>
                 </form>
              </header>


             Confluence content
             <div className="content">
             <ul>
             {currentBlogs.map((link, index) => (
                  <li key={index}>
                          {link === 'Keyword not found' ? (
                                     <p>Keyword not found</p>
                                         ) : (
                                              <a href={encodeURI(currentBlogs[index])} target="_blank">{currentBlogs1[index]}</a>
                                              )}

                  </li>
             ))}
             </ul>


             <div className="page">
             {renderPageNumbers} </div>
             </div>


            Elasticsearch Logs
            <div className="content">
            <ul>
               {currentBlogs2.map((link,index)=>(
                    <li key={index}>
                          {link==='Keyword not found'?(
                                   <p>Keyword not found</p>
                                    ):(<p>{currentBlogs2[index]}</p>
                                    )}

                    </li>
                    ))}
            </ul>

            <div className="page">
                {renderPageNumbers1}
            </div>
            </div>


             Stackoverflow results

             <div className="content">
              <ul>
                   {currentBlogs3.map((link, index) => (
                        <li key={index}>
                                {link === 'Keyword not found' ? (
                                           <p>Keyword not found</p>
                                               ) : (
                                                    <a href={encodeURI(currentBlogs3[index])} target="_blank">{currentBlogs4[index]}</a>
                                                            )}
                        </li>
                   ))}
               </ul>

                 <div className="page">
                     {renderPageNumbers2}
                 </div>
               </div>


     </div>
     </div>

     );
     }

export default App;

