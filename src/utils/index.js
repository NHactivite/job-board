import qs from "query-string"

 export const recruiterOnboardFRomControl=[
    {
        label:"Name",
        name:"name",
        placeholder:"Enter your Name",
        componentType:"input"
    },
    {
        label:"Company Name",
        name:"companyName",
        placeholder:"Enter your Company name",
        componentType:"input"
    },
    {
        label:"Company Role",
        name:"companyRole",
        placeholder:"Enter your Company Role",
        componentType:"input"
    },
 ]
 export const candidateOnboardFRomControl=[
    {
        label:"Resume",
        name:"resume",
        componentType:"file"
    },
    {
        label:"Name",
        name:"name",
        placeholder:"Enter your Name",
        componentType:"input"
    },
    {
        label:"Current Company Name",
        name:"currentCompanyName",
        placeholder:"Enter your Current Company name",
        componentType:"input"
    },
    {
        label:"Prefered Job Location",
        name:"preferedJobLocation",
        placeholder:"Enter your prefered Job Location",
        componentType:"input"
    },
    {
        label:"Current Job Location",
        name:"currentJobLocation",
        placeholder:"Enter your Current Job Location",
        componentType:"input"
    },
    {
        label:"Current Salary",
        name:"currentSalary",
        placeholder:"Enter your Current Salary",
        componentType:"input"
    },
    {
        label:"Notice Period",
        name:"noticePeriod",
        placeholder:"Enter your Notice Period",
        componentType:"input"
    },
    {
        label:"Skills",
        name:"skills",
        placeholder:"Enter your Skills",
        componentType:"input"
    },
    {
        label:"Previous Companies",
        name:"previousCompanies",
        placeholder:"Enter your Previous Companies",
        componentType:"input"
    },
    {
        label:"Total Experience",
        name:"totalExperience",
        placeholder:"Enter your Total Experience",
        componentType:"input"
    },
    {
        label:"College",
        name:"college",
        placeholder:"Enter your College",
        componentType:"input"
    },
    {
        label:"College Location",
        name:"collegeLocation",
        placeholder:"Enter your College Location",
        componentType:"input"
    },
    {
        label:"Graduated Year",
        name:"graduatedYear",
        placeholder:"Enter your Graduated Year",
        componentType:"input"
    },
    {
        label:"Linkedin Profile",
        name:"linkedinProfile",
        placeholder:"Enter your Linkedin Profile",
        componentType:"input"
    },
    {
        label:"Github Profile",
        name:"githubProfile",
        placeholder:"Enter your Github Profile",
        componentType:"input"
    },
 ]

 export const initialRecruiterFromData={
    name:"",
    companyName:"",
    companyRole:"",
 }
 export const initialCandidateFromData={
    resume:{
        path:"",
        publicPath:""
    },
    name:"",
    currentCompanyName:"",
    currentSalary:"",
    currentJobLocation:"",
    preferedJobLocation:"",
    previousCompanies:"",
    noticePeriod:"",
    skills:"",
    linkedinProfile:"",
    githubProfile:"",
    graduatedYear:"",
    collegeLocation:"",
    college:"",
    totalExperience:"",
    collegeLocation:"",
 }


 export const postNewJobFromControls=[
    {
        label:"Company Name",
        name:"companyName",
        placeholder:"Enter your Company Name",
        componentType:"input",
        disabled:true 
    },
    {
        label:"Title",
        name:"title",
        placeholder:"Job Title",
        componentType:"input"  
    },
    {
        label:"Type",
        name:"type",
        placeholder:"Job Type",
        componentType:"input"  
    },
    {
        label:"Location",
        name:"location",
        placeholder:"Job Location",
        componentType:"input"  
    },
    {
        label:"Experience",
        name:"experience",
        placeholder:"Job Experience",
        componentType:"input"  
    },
    {
        label:"Description",
        name:"description",
        placeholder:"Job Description",
        componentType:"input"  
    },
    {
        label:"Skills",
        name:"skills",
        placeholder:"Job Skills",
        componentType:"input"  
    },
 ]
 export const initialPostNewJobFromData={
       companyName:"",
       title:"",
       type:"",
       location:"",
       experience:"",
       description:"",
       skills:""
    }
 
    
    export const filterMenuData=[
        {
            id:"companyName",
            label:"Company Name"
        },
        {
            id:"title",
            label:"Title"
        },
        {
            id:"type",
            label:"Type"
        },
        {
            id:"location",
            label:"Location"
        }
    ]


export function formUrlQuery({params,dataToAdd}){
    let currentURL=qs.parse(params);

    if(Object.keys(dataToAdd).length>0){
        Object.keys(dataToAdd).map(key=>{
            if(dataToAdd[key].length===0){
                delete currentURL[key]
            }else{
                currentURL[key]=dataToAdd[key].join(",")
            }
        })
    }

    return qs.stringifyUrl({
        url:window.location.pathname,
        query:currentURL,
    },{
        skipNull:true
    })
}



export const memberShipPlans=[
    {
        heading:"Tier 1",
        price:100,
        type:"basic",
    },
    {
        heading:"Tier 2",
        price:500,
        type:"teams",
    },
    {
        heading:"Tier 3",
        price:1000,
        type:"enterprise",
    },
]