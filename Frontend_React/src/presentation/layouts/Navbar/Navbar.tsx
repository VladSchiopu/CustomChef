import { useCallback, useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';
import { AppRoute } from 'routes';
import { useIntl } from 'react-intl';
import { useAppDispatch, useAppSelector } from '@application/store';
import { IconButton } from '@mui/material';
import { resetProfile } from '@application/state-slices';
import { useAppRouter } from '@infrastructure/hooks/useAppRouter';
import { NavbarLanguageSelector } from '@presentation/components/ui/NavbarLanguageSelector/NavbarLanguageSelector';
import { useOwnUserHasRole } from '@infrastructure/hooks/useOwnUser';
import { UserControllerApi, Configuration } from "@infrastructure/apis/client";

export const Navbar = () => {
  const { formatMessage } = useIntl();
  const { loggedIn, token } = useAppSelector(x => x.profileReducer);
  const isAdmin = useOwnUserHasRole("ADMIN");
  const dispatch = useAppDispatch();
  const { redirectToHome } = useAppRouter();

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyId = async () => {
      if (loggedIn && token) {
        try {
          const api = new UserControllerApi(new Configuration({ accessToken: token }));
          const me = await api.getCurrentUser();
          setUserId(me.id || null);
        } catch (e) {
          console.error("Could not get profile ID", e);
        }
      } else {
        setUserId(null);
      }
    };

    fetchMyId();
  }, [loggedIn, token]);

  const logout = useCallback(() => {
    dispatch(resetProfile());
    setUserId(null);
    redirectToHome();
  }, [dispatch, redirectToHome]);

  return <>
    <div className="w-full top-0 z-50 fixed">
      <AppBar sx={{ bgcolor: '#FF7034' }}>
        <Toolbar>
          <div className="grid grid-cols-12 gap-y-5 gap-x-4 justify-center items-center w-full">
            <div className="col-span-1">
              <Link to={AppRoute.Index}>
                <IconButton>
                  <HomeIcon style={{color: 'white'}} fontSize='large'/>
                </IconButton>
              </Link>
            </div>

            <div className="col-span-8 flex gap-2">
              {isAdmin && (
                <Button color="inherit">
                  <Link style={{color: 'white'}} to={AppRoute.Users}>
                    {formatMessage({id: "globals.users"})}
                  </Link>
                </Button>
              )}
              
              {loggedIn && (
                <>
                  <Button color="inherit">
                    <Link style={{color: 'white'}} to={AppRoute.Posts}>
                      {formatMessage({id: "globals.posts"})} 
                    </Link>
                  </Button>
                  <Button color="inherit">
                    <Link style={{color: 'white'}} to={AppRoute.MyRecipes}>
                        {formatMessage({id: "globals.recipes"})} 
                    
                    </Link>
                  </Button>
                  
                  {userId && (
                    <Button color="inherit" startIcon={<AccountCircleIcon />}>
                      <Link style={{color: 'white'}} to={`/profile/${userId}`}>
                       {formatMessage({id: "globals.profile"})} 
        
                      </Link>
                    </Button>
                  )}

                  <Button color="inherit">
                    <Link style={{color: 'white'}} to={AppRoute.Feedback}>
                      Feedback
                    </Link>
                  </Button>
                </>
              )}
            </div>

            <div className="col-span-1 flex justify-center">
              <NavbarLanguageSelector/>
            </div>

            <div className="col-span-2 flex justify-end gap-2 items-center">
              {!loggedIn ? (
                <>
                  <Button color="inherit">
                    <Link style={{color: 'white', whiteSpace: 'nowrap'}} to={AppRoute.Login}>
                      {formatMessage({id: "globals.login"})}
                    </Link>
                  </Button>
                  <Button color="inherit">
                    <Link style={{color: 'white', whiteSpace: 'nowrap'}} to={AppRoute.Register}>
                      {formatMessage({id: "globals.register"})} 
                    </Link>
                  </Button>
                </>
              ) : (
                <Button onClick={logout} color="inherit" style={{ whiteSpace: 'nowrap' }}>
                  {formatMessage({id: "globals.logout"})}
                </Button>
              )}
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </div>
    <div className="w-full top-0 z-49">
      <div className="min-h-20"/>
    </div>
  </>
}