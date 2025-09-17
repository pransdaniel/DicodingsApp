// import HomePage from '../pages/home/home-page.js';
// import AboutPage from '../pages/about/about-page.js';
// import StoriesPage from '../pages/stories/stories-page.js';
// import AddStoryPage from '../pages/add-story/add-story-page.js';
// import LoginPage from '../pages/auth/login-page.js';
// import RegisterPage from '../pages/auth/register-page.js';


// const routes = {
//   '/': new HomePage(),
//   '/about': new AboutPage(),
//   '/stories': new StoriesPage(),
//   '/add-story': new AddStoryPage(),
//   '/login': new LoginPage(),
//   '/register': new RegisterPage(),
// };

// export default routes;
// src/routes/routes.js
import HomeMVP from '../pages/home/home-mvp.js';
import AboutMVP from '../pages/about/about-mvp.js';
import StoriesMVP from '../pages/stories/stories-mvp.js';
import AddStoryMVP from '../pages/add-story/add-story-mvp.js';
import LoginMVP from '../pages/auth/login-mvp.js';
import RegisterMVP from '../pages/auth/register-mvp.js';

const routes = {
  '/': new HomeMVP(),
  '/about': new AboutMVP(),
  '/stories': new StoriesMVP(),
  '/add-story': new AddStoryMVP(),
  '/login': new LoginMVP(),
  '/register': new RegisterMVP(),
};

export default routes;