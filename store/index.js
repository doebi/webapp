import Vuex from 'vuex';
import auth0 from 'auth0-js';

const cookieparser = process.server ? require('cookieparser') : undefined
const Cookie = process.client ? require('js-cookie') : undefined

let webAuth = new auth0.WebAuth({
  domain:       'grandgarage.eu.auth0.com',
  clientID:     'lwqb_LrkbU8b2rHfbC05C87xqM4bSfms',
  responseType: 'token id_token',
  scope: 'openid profile email',
  //redirectUri:  'https://dev.grandgarage.eu/auth'
  redirectUri:  'http://localhost:3000/auth'
});

let version = 'draft';

const createStore = () => {
  return new Vuex.Store({
    state: {
      cacheVersion: '',
      debug: '',
      language: 'de',
      sidebar: null,
      settings: {},
      user: null,
      auth: null
    },
    mutations: {
      setAuth(state, auth) {
        state.auth = auth
      },
      setUser (state, user) {
        state.user = user;
      },
      setSettings (state, settings) {
        state.settings = settings;
      },
      setLanguage (state, language) {
        state.language = language;
      },
      setCacheVersion (state, version) {
        state.cacheVersion = version;
      }
    },
    actions: {
      nuxtServerInit({ commit }, { req }) {
        let auth = null
        if (req.headers.cookie) {
          const parsed = cookieparser.parse(req.headers.cookie)
          try {
            auth = JSON.parse(parsed.auth)
          } catch (err) {
            // No valid cookie found
          }
        }
        commit('setAuth', auth)
      },
      getUser({ state, commit }) {
        // get profile from fabman
        let user = {};
        commit('setUser', user);
      },
      auth({ commit }, { hash }) {
        return new Promise((resolve, reject) => {
          webAuth.parseHash({ hash }, function(err, authResult) {
            if (err) {
              return reject(err);
            }

            //set auth
            let auth = {
              accessToken: authResult.accessToken,
              fabmanId: idTokenPayload['https://grandgarage.eu/fabmanId'],
            }
            Cookie.set('auth', auth)
            commit('setAuth', auth);
            resolve();
          });
        });
      },
      logout({ commit }) {
        Cookie.remove('auth')
        commit('setAuth', null)
      },
      loginUser({ commit }, context) {
        return new Promise((resolve, reject) => {
          webAuth.login({
            connection: 'Username-Password-Authentication',
            email: context.email,
            password: context.password,
          });
        });
      },
      registerUser({ commit }, context) {
        return new Promise((resolve, reject) => {
          webAuth.signup({
            connection: 'Username-Password-Authentication',
            email: context.email,
            password: context.password,
            user_metadata: context.user_metadata,
          }, function (err, r) {
            if (err) reject(err);
            resolve(r);
          });
        });
      },
      setSidebar({state}, value) {
        state.sidebar = value;
      },
      loadTags ({state}) {
        return this.$storyapi.get(`cdn/tags`, {
        }).then((res) => {
          return res.data.tags;
        });
      },
      loadTeam ({state}) {
        return this.$storyapi.get(`cdn/stories`, {
          filter_query: {
            'component': {
              'in': 'team-member'
            }
          },
          version: version,
          cv: state.cacheVersion
        }).then((res) => {
          return res.data;
        });
      },
      loadFullPage ({state}, path) {
        return this.$storyapi.get(`cdn/stories${path}`, {
          version: version,
          cv: state.cacheVersion
        }).then((res) => {
          return res.data;
        })
      },
      loadPage ({state}, path) {
        if (!path) {
          path = '/';
        }

        return this.$storyapi.get(`cdn/stories/${state.language}${path}`, {
          version: version,
          cv: state.cacheVersion
        }).then((res) => {
          return res.data;
        })
      },
      loadMachineItem ({state}, slug) {
        let endpoint = `cdn/stories/${state.language}/machines/${slug}`;
        // TODO: entich with tags
        return this.$storyapi.get(endpoint, {
          version: version,
          cv: state.cacheVersion
        }).then((res) => {
          return res.data;
        }).catch((res) => {
          console.log(res);
        });
      },
      loadWorkshopItem ({state}, slug) {
        let endpoint = `cdn/stories/${state.language}/workshops/${slug}`;
        return this.$storyapi.get(endpoint, {
          version: version,
          cv: state.cacheVersion
        }).then((res) => {
          return res.data;
        }).catch((res) => {
          console.log(res);
        });
      },
      findMachines ({state}, filters) {
        return this.$storyapi.get(`cdn/stories`, {
          ...filters,
          version: version,
          cv: state.cacheVersion,
        }).then((res) => {
          return res.data;
        }).catch((res) => {
          console.log(res);
        });
      },
      findWorkshops ({state}, filters) {
        return this.$storyapi.get(`cdn/stories`, {
          ...filters,
          version: version,
          cv: state.cacheVersion,
        }).then((res) => {
          return res.data;
        }).catch((res) => {
          console.log(res);
        });
      },
      loadNewsItem ({state}, slug) {
        let endpoint = `cdn/stories/${state.language}/news/${slug}`;
        return this.$storyapi.get(endpoint, {
          version: version,
          cv: state.cacheVersion
        }).then((res) => {
          return res.data;
        }).catch((res) => {
          console.log(res);
        });
      },
      findNews ({state}, filters) {
        return this.$storyapi.get('cdn/stories', {
          filter_query: filters.filter_query,
          version: version,
          cv: state.cacheVersion,
          starts_with: `${state.language}/news`,
        }).then((res) => {
          return res.data;
        }).catch((res) => {
          console.log(res);
        });
      },
      loadSitemap ({ state, commit }) {
        return this.$storyapi.get('cdn/links', {
          version: version,
          cv: state.cacheVersion,
          starts_with: state.language,
        }).then((res) => {
          return res.data
        }).catch((res) => {
          console.log(res);
        })
      },
      loadSettings ({ state, commit }, context) {
        return this.$storyapi.get(`cdn/stories/${context.language}/settings`, {
          version: version,
        }).then((res) => {
          commit('setSettings', res.data.story.content)
        }).catch((e) => {
          console.log(e);
        });
      },
    }
  })
}

export default createStore
