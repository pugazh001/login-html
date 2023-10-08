class APIFeatures{
    constructor(query,querystr){
        this.query=query;
        this.querystr=querystr;
    }
    search(){
        let keyword=this.querystr.keyword ?{
            name:{
                $regex:this.querystr.keyword,
                $options:'i' //it any case return upper or lower case
            }
        }:{};
        this.query.find({...keyword});
        return this


    }
    filter(){
        const querystrCopy={...this.querystr}
            //before
        //console.log(querystrCopy);

        //removing fields for query

        const removeFields=['keyword','limit','page'];
        removeFields.forEach(field=>delete querystrCopy[field]);

        //after
       //  console.log(querystrCopy);
           //filter price

           let querystr=JSON.stringify(querystrCopy);
          querystr= querystr.replace(/\b(gt|gte|lt|lte)/g,match=>`$${match}`);
         // console.log(querystr);
    
          this.query.find(JSON.parse(querystr))

        return this;
    }
    //pagination 

    paginate(resPerPage){
        const currentPage=Number(this.querystr.page)||1;
        const skip=resPerPage*(currentPage-1);
        this.query.limit(resPerPage).skip(skip);
        return this;
    }

}
module.exports=APIFeatures;