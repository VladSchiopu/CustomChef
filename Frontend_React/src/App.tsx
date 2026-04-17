import { useOwnUserHasRole, useTokenHasExpired } from "@infrastructure/hooks/useOwnUser";
import { AppIntlProvider } from "@presentation/components/ui/AppIntlProvider";
import { ToastNotifier } from "@presentation/components/ui/ToastNotifier";
import { HomePage } from "@presentation/pages/HomePage";
import { LoginPage } from "@presentation/pages/LoginPage";
import { RegisterPage } from "@presentation/pages/RegisterPage";
import { PostsPage } from "@presentation/pages/PostsPage";
import { MyRecipesPage } from "@presentation/pages/MyRecipesPage";
import { UsersPage } from "@presentation/pages/UsersPage";
import { UsersSearchPage } from "@presentation/pages/UsersSearchPage";
import { ProfilePage } from "@presentation/pages/ProfilePage";
import { FeedbackPage } from "@presentation/pages/FeedbackPage";
import { Route, Routes } from "react-router-dom";
import { AppRoute } from "routes";

export function App() {
  const isAdmin = useOwnUserHasRole("ADMIN");
  const {loggedIn} = useTokenHasExpired();

  return <AppIntlProvider> {/* AppIntlProvider provides the functions to search the text after the provides string ids. */}
      <ToastNotifier />
      {/* This adds the routes and route mappings on the various components. */}
      <Routes>
        <Route path={AppRoute.Index} element={<HomePage />} />
        <Route path={AppRoute.Login} element={<LoginPage />} />
        <Route path={AppRoute.Register} element={<RegisterPage />} />
        {loggedIn && <Route path={AppRoute.Feedback} element={<FeedbackPage />} />}
        {loggedIn && <Route path={AppRoute.Posts} element={<PostsPage />} />}
        {loggedIn && <Route path={AppRoute.MyRecipes} element={<MyRecipesPage />} />}
        {isAdmin && <Route path={AppRoute.Users} element={<UsersPage />} />} 
        {loggedIn && <Route path={AppRoute.UsersSearch} element={<UsersSearchPage />} />}
        {loggedIn && <Route path={AppRoute.UserProfile} element={<ProfilePage />} />}
      </Routes>
    </AppIntlProvider>
}
