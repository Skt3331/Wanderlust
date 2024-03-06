// const passport=require("passport");

module.exports.login=async(req,res)=>
{
   req.flash("sucess","welcome to wanderlust");
  
   res.redirect(res.locals.redirectUrl||"/listings")  //if res.locals.redirect is undefiend it will directly redirect to / listings
   }


module.exports.logout=(req,res)=>
{
    req.logOut((err)=>
    {
        if(err)
        {
            return next(err);
        }
       req.flash("sucess","logged out sucess");
       res.redirect("/listings");
    })
};

module.exports.signup=async(req,res)=>
{
    try
    {

    
    let{username,email,password}=req.body;
  
    let nuser=new User(
        {
          email:email,
          username:username
        }
      );
     let regnew= await User.register(nuser,password);
     req.login(regnew,(err)=>
     {
        if(err)
        {
            return next(err);
        }
    req.flash("sucess","user signup sucess");
    res.redirect("/listings");
         })
     
    }
    catch(e)
    {
   req.flash("error",e.message);
   res.redirect("/signup");
    }
};