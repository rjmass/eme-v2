import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';
import { App, Home, Templates, NotFound,
  Emails, Snippets, Analytics,
  Images, Account, Users, Campaigns
} from 'containers';
import { TemplatesIndex, TemplateDetails, TemplateCreate } from 'components/Templates';
import { EmailsIndex, EmailDetails } from 'components/Emails';
import { AnalyticsIndex, AnalyticsDetails, AnalyticsActionDetails } from 'components/Analytics';
import { ImagesIndex } from 'components/Images';
import { AccountIndex } from 'components/Account';
import { UsersIndex, UserCreate, UsersDetails } from 'components/Users';
import {
  SnippetsIndex,
  SnippetDetails,
  SnippetCreate
} from 'components/Snippets';
import { CampaignsIndex, CampaignDetails, CampaignCreate } from 'components/Campaigns';
import config from 'config';

export default (store) => {
  const requireLogin = (nextState, replace, cb) => {
    function checkAuth() {
      const { auth: { user } } = store.getState();
      if (!user) {
        // oops, not logged in, so can't be here!
        replace({
          pathname: '/',
          state: { nextPathname: nextState.location.pathname }
        });
      }
      cb();
    }

    checkAuth();
  };

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path={`${config.urlInfix}/`} component={App}>
      <IndexRoute component={Home} />
      {/* Routes requiring login */}
      <Route onEnter={requireLogin}>
        <Route path="analytics" component={Analytics}>
          <IndexRoute component={AnalyticsIndex} />
          <Route path="list/:page" component={AnalyticsIndex} />
          <Route path="emails/:id" component={AnalyticsDetails} />
          <Route path="emails/:id/:action" component={AnalyticsActionDetails} />
          <Route path="emails/:id/:action/list/:page" component={AnalyticsActionDetails} />
        </Route>
        <Route path="campaigns" component={Campaigns}>
          <IndexRoute component={CampaignsIndex} />
          <Route path="list/:page" component={CampaignsIndex} />
          <Route path="new" component={CampaignCreate} />
          <Route path=":id" component={CampaignDetails} />
        </Route>
        <Route path="emails" component={Emails}>
          <IndexRoute component={EmailsIndex} />
          <Route path="list/:page" component={EmailsIndex} />
          <Route path=":id" component={EmailDetails} />
        </Route>
        <Route path="images" component={Images}>
          <IndexRoute component={ImagesIndex} />
        </Route>
        <Route path="snippets" component={Snippets}>
          <IndexRoute component={SnippetsIndex} />
          <Route path="list/:page" component={SnippetsIndex} />
          <Route path="new" component={SnippetCreate} />
          <Route path=":id" component={SnippetDetails} />
        </Route>
        <Route path="templates" component={Templates}>
          <IndexRoute component={TemplatesIndex} />
          <Route path="list/:page" component={TemplatesIndex} />
          <Route path="new" component={TemplateCreate} />
          <Route path=":id" component={TemplateDetails} />
        </Route>
        <Route path="account" component={Account}>
          <IndexRoute component={AccountIndex} />
        </Route>
        <Route path="images" component={Images}>
          <IndexRoute component={ImagesIndex} />
        </Route>
        <Route path="users" component={Users}>
          <IndexRoute component={UsersIndex} />
          <Route path="list/:page" component={UsersIndex} />
          <Route path="new" component={UserCreate} />
          <Route path=":id" component={UsersDetails} />
        </Route>
      </Route>
      <Redirect from="/" to={`${config.urlInfix}/`} />
       {/* Catch all route */}
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
