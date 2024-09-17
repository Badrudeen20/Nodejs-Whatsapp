const { User } = require('../models');
const CustomStrategy = require('passport-custom').Strategy;
const initializePassport = (passport) => {
 
  passport.use('custom',
    new CustomStrategy(
        async (req, done) => {
          try {
            const user = await User.findOne({
              where: {
                mobile: req.body.mobile,
              },
            })
            
            if(user){
              return done(null, {id:user.id,username:user.username,mobile:user.mobile});
            }else{
              return done(null, false, { message: 'Incorrect mobile' });
            }
          } catch (error) {
            return done(error);
          }

        }
    )

  );

  passport.serializeUser((auth, done) => {
    done(null, auth.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id: id } })
      done(null, user);
    } catch (error) {
      done(error, null);
    }
    
  });
};
module.exports = initializePassport;
