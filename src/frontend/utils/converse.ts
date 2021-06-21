import 'converse.js/dist/converse.min.css';
import 'converse.js/dist/converse.min.js';
import 'converse.js/dist/emojis.js';
import 'converse.js/dist/icons.js';

import { converse } from './window';
import { getDecodedJwt } from '../data/appData';
import { XMPP } from '../types/tracks';

const INSTRUCTOR_USERNAME = "John"

export const converseMounter = () => {
  let hasBeenInitialized = false;

  return (containerName: string, xmpp: XMPP) => {
    if (hasBeenInitialized) {
      converse.insertInto(document.querySelector(containerName)!);
    } else {
      console.log("env")
      console.log(converse);
      converse.initialize({
        allow_contact_requests: false,
        allow_logout: false,
        allow_message_corrections: 'last',
        allow_message_retraction: 'all',
        allow_muc_invitations: false,
        allow_registration: false,
        authentication: 'anonymous',
        auto_login: true,
        auto_join_rooms: [xmpp.conference_url],
        bosh_service_url: xmpp.bosh_url,
        clear_cache_on_logout: true,
        discover_connection_methods: false,
        hide_muc_participants: true,
        jid: xmpp.jid,
        modtools_disable_assign: true,
        muc_instant_rooms: false,
        nickname: getDecodedJwt().user?.username,
        root: document.querySelector(containerName),
        show_client_info: false,
        singleton: true,
        theme: 'concord',
        view_mode: 'embedded',
        visible_toolbar_buttons: {
          call: false,
          emoji: true,
          spoiler: false,
          toggle_occupants: false,
        },
        whitelisted_plugins: ['marsha', 'marsha-mount-on-stage'],
      });
      const { Promise, Strophe, dayjs, sizzle, _, $build, $iq, $msg, $pres } = converse.env;
      converse.plugins.add('marsha', {
        initialize() {
          const _converse = this._converse;

          window.addEventListener('beforeunload', () => {
            _converse.api.user.logout();
          });
        },
      });
      converse.plugins.add('marsha-mount-on-stage', {
        initialize() {
          const _converse = this._converse;

          _converse.on('connected', () => {
            console.log(_converse.connection)
            _converse.connection.addHandler((message: any) => {
              console.log(message);
              if (message.getAttribute('type') === "event" && message.getAttribute('event') === "asktomount") {
                console.log("ASKTOMOUNT");
                const jid = message.getAttribute('from')
                const matches = jid.match(/^[\s\S]+\/([\s\S]+)$/);
                const username = matches ? matches[1] : "AnonymousStudent"; 
                const event = new CustomEvent('studentAsking', { detail: { id: jid, name: username } });
                window.dispatchEvent(event);
              } else if (message.getAttribute('type') === "event" && message.getAttribute('event') === "accept") {
                console.log("ACCEPT");
                const event = new Event('accepted');
                window.dispatchEvent(event);
              } else if (message.getAttribute('type') === "event" && message.getAttribute('event') === "reject") {
                console.log("REJECT");
                const event = new Event('rejected');
                window.dispatchEvent(event);
              } else if (message.getAttribute('type') === "event" && message.getAttribute('event') === "kick") {
                const event = new Event('kicked');
                window.dispatchEvent(event);
              } else if (message.getAttribute('type') === "event" && message.getAttribute('event') === "leave") {
                const event = new CustomEvent('studentLeaving', { detail: { id: message.getAttribute('from') } });
                window.dispatchEvent(event);
              }
              return true;
            }, null, "message", null, null, null);

            window.addEventListener('asktomount', () => {
              var msg = converse.env.$build('message', {
                from: _converse.connection.jid,
                to: "1cd13376-4051-42d5-9d46-c1a2eb22718a@conference.prosody/" + INSTRUCTOR_USERNAME,
                type: "event",
                event: "asktomount"
              });
              _converse.connection.send(msg);
            });

            window.addEventListener('accept', (params: any) => {
              var msg = converse.env.$build('message', {
                from: _converse.connection.jid,
                to: params.detail.id,
                type: "event",
                event: "accept"
              });
              _converse.connection.send(msg);
            });

            window.addEventListener('reject', (params: any) => {
              var msg = converse.env.$build('message', {
                from: _converse.connection.jid,
                to: params.detail.id,
                type: "event",
                event: "reject"
              });
              _converse.connection.send(msg);
            });

            window.addEventListener('kick', (params: any) => {
              var msg = converse.env.$build('message', {
                from: _converse.connection.jid,
                to: params.detail.id,
                type: "event",
                event: "kick"
              });
              _converse.connection.send(msg);
            });

            window.addEventListener('leave', (params: any) => {
              var msg = converse.env.$build('message', {
                from: _converse.connection.jid,
                to: "1cd13376-4051-42d5-9d46-c1a2eb22718a@conference.prosody/" + INSTRUCTOR_USERNAME,
                type: "event",
                event: "leave"
              });
              _converse.connection.send(msg);
            });
          })
        }
      })
      hasBeenInitialized = true;
    }
  };
};
