import { WebsiteLayout } from "presentation/layouts/WebsiteLayout";
import { Typography, Button, TextField, Box } from "@mui/material";
import { Fragment, memo, useState } from "react";
import { Seo } from "@presentation/components/ui/Seo";
import { ContentCard } from "@presentation/components/ui/ContentCard";
import { useAppSelector } from '@application/store';
import { Link, useNavigate } from "react-router-dom";
import { AppRoute } from "routes";
import { useIntl } from "react-intl";

export const HomePage = memo(() => {
  const { loggedIn } = useAppSelector(x => x.profileReducer);
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const [searchQuery, setSearchQuery] = useState("");

  const orangeButtonStyle = {
    bgcolor: '#FF7034',
    color: 'white',
    '&:hover': {
      bgcolor: '#e65f2b',
    },
    textTransform: 'none',
    fontWeight: 'bold'
  };

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim() !== "") {
      navigate(`${AppRoute.UsersSearch}?query=${searchQuery}`);
    }
  };

  return (
    <Fragment>
      <Seo title={`Custom Chef | ${formatMessage({ id: "globals.home" })}`} />
      <WebsiteLayout>
        <div className="pl-[50px] pr-[50px]">
          <ContentCard title={formatMessage({ id: "globals.welcome_title" })}>
            
            {!loggedIn ? (
              <div className="flex flex-col items-center gap-6 mt-4 mb-4">
                <Typography variant="h6" align="center">
                  {formatMessage({ id: "globals.welcome_description" })}
                </Typography>
                <div className="flex gap-4">
                  <Button 
                    variant="contained" 
                    sx={orangeButtonStyle} 
                    component={Link} 
                    to={AppRoute.Login}
                  >
                    {formatMessage({ id: "globals.login" })}
                  </Button>
                  <Button 
                    variant="contained" 
                    sx={orangeButtonStyle} 
                    component={Link} 
                    to={AppRoute.Register}
                  >
                    {formatMessage({ id: "globals.register" })}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 mt-4 mb-4">
                <Typography variant="h6" align="center">
                  {formatMessage({ id: "globals.welcome_back" })}
                </Typography>

                <div className="w-full max-w-md my-4">
                  <TextField 
                    label={formatMessage({ id: "globals.search_chefs" })} 
                    variant="outlined" 
                    fullWidth
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    placeholder={formatMessage({ id: "globals.search_press_enter" })}
                  />
                </div>

                <div className="flex gap-4">
                  <Button 
                    variant="contained" 
                    sx={orangeButtonStyle} 
                    component={Link} 
                    to={AppRoute.Posts}
                  >
                    {formatMessage({ id: "globals.view_latest_posts" })}
                  </Button>
                  <Button 
                    variant="contained" 
                    sx={orangeButtonStyle} 
                    component={Link} 
                    to={AppRoute.MyRecipes}
                  >
                    {formatMessage({ id: "globals.manage_recipes" })}
                  </Button>
                </div>
              </div>
            )}

          </ContentCard>
        </div>
      </WebsiteLayout>
    </Fragment>
  );
});