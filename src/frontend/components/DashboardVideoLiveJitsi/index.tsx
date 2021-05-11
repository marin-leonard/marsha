import { Box, Heading, Text } from 'grommet';
import React, { useEffect, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { appData } from '../../data/appData';
import { useVideo } from '../../data/stores/useVideo';
import { API_ENDPOINT } from '../../settings';
import { modelName } from '../../types/models';
import { Video, liveState } from '../../types/tracks';
import { report } from '../../utils/errors/report';
import { PLAYER_ROUTE } from '../routes';
import { DashboardVideoLiveStartButton } from '../DashboardVideoLiveStartButton';
import { DashboardVideoLiveJitsiStopButton } from '../DashboardVideoLiveJitsiStopButton';
import { DashboardButtonWithLink } from '../DashboardPaneButtons';

declare global {
  interface Window {
    JitsiMeetExternalAPI:any;
  }
}

const messages = defineMessages({
  title: {
    defaultMessage: 'Jitsi Streaming',
    description: 'DashboardVideoLiveJitsi main title.',
    id: 'components.DashboardVideoLiveJitsi.title',
  },
  showLive: {
    defaultMessage: 'show live',
    description: 'button to redirect use to video player.',
    id: 'components.DashboardVideoLiveJitsi.showLive',
  },
  liveCreating: {
    defaultMessage:
      'Live streaming is being created. You will be able to start it in a few seconds',
    description: 'Helptext explainig to wait until the live is created.',
    id: 'components.DashboardVideoLiveJitsi.liveCreating',
  },
  liveStarting: {
    defaultMessage:
      'Live streaming is starting...',
    description: 'Helptext explainig to wait until the live is ready.',
    id: 'components.DashboardVideoLiveJitsi.liveStarting',
  },
  liveStopped: {
    defaultMessage:
      'Live streaming is ended. The process to transform the live to VOD has started. You can close the window and come back later.',
    description:
      'Helptext explaining that the live is ended and the live to VOD process has started.',
    id: 'components.DashboardVideoLiveJitsi.liveStopped',
  },
  liveStopping: {
    defaultMessage:
      'Live streaming is ending. The process to transform the live to VOD will begin soon. You can close the window and come back later.',
    description:
      'Helptext explaining that the live is ending and the live to VOD process will start.',
    id: 'components.DashboardVideoLiveJitsi.liveStopping',
  },
});

interface DashboardVideoLiveJitsiProps {
  video: Video;
}

export const DashboardVideoLiveJitsi = ({ video }: DashboardVideoLiveJitsiProps) => {
  const jitsiContainerId = "jitsi-container-id";
  const [jitsi, setJitsi] = useState<any | undefined>({});
  const { updateVideo } = useVideo((state) => ({
    updateVideo: state.addResource,
  }));
  const pollForVideo = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/videos/${video.id}/`, {
        headers: {
          Authorization: `Bearer ${appData.jwt}`,
        },
      });

      const incomingVideo: Video = await response.json();

      if (
        incomingVideo.live_state === liveState.RUNNING ||
        incomingVideo.live_state === liveState.IDLE
      ) {
        if (incomingVideo.live_state === liveState.RUNNING) {
          const endpointIdentifier = /^(rtmp:\/\/.*)\/(.*)$/;
          const endpoints = incomingVideo.live_info.medialive!.input.endpoints.map(
            (endpoint) => {
              const matches = endpoint.match(endpointIdentifier);
              if (matches) {
                return (matches[1] + "/marsha/" + matches[2])
              }
            }
          )
          console.log("endpoints")
          console.log(endpoints)
          jitsi.executeCommand('startRecording', {
            mode: 'stream',
            rtmpStreamKey: endpoints[0]
          })
        }
        updateVideo(incomingVideo);
      }
    } catch (error) {
      report(error);
    }
  };

  const loadJitsiScript = () => {
    let resolveLoadJitsiScriptPromise = null;

    const loadJitsiScriptPromise = new Promise((resolve) => {
      resolveLoadJitsiScriptPromise = resolve;
    });

    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    script.onload = resolveLoadJitsiScriptPromise
    document.body.appendChild(script);

    return loadJitsiScriptPromise;
  };

  const initialiseJitsi = async () => {
    if (!window.JitsiMeetExternalAPI) {
      await loadJitsiScript();
    }

    const _jitsi: any = new window.JitsiMeetExternalAPI("preprod.meeting.education", {
      parentNode: document.getElementById(jitsiContainerId),
      roomName: video.id
    });

    setJitsi(_jitsi)
    _jitsi.getLivestreamUrl().then((livestreamData: any) => {
        console.log("jitsiDebug " + livestreamData?.livestreamUrl)
    });
  };

  useEffect(() => {
    initialiseJitsi();

    return () => jitsi?.dispose?.();
  }, []);

  useEffect(() => {
    const intervalMs = {
      [liveState.STARTING]: 15000,
      [liveState.CREATING]: 2000,
    };
    if (
      video.live_state === liveState.STARTING ||
      video.live_state === liveState.CREATING
    ) {
      const interval = setInterval(pollForVideo, intervalMs[video.live_state]);
      return () => clearInterval(interval);
    }
  }, [video.live_state]);

  return (
    <Box>
      <Heading level={2}>
        <FormattedMessage {...messages.title} />
      </Heading>
      <Box height={'large'} id={jitsiContainerId} />
      <Box direction={'row'} justify={'center'} margin={'small'}>
        {video.live_state === liveState.CREATING && (
            <Text>
              <FormattedMessage {...messages.liveCreating} />
            </Text>
          )}
          {video.live_state === liveState.IDLE && (
            <DashboardVideoLiveStartButton video={video}/>
          )}
          {video.live_state === liveState.STARTING && (
            <Text>
              <FormattedMessage {...messages.liveStarting} />
            </Text>
          )}
          {video.live_state === liveState.RUNNING && (
            <React.Fragment>
              <DashboardVideoLiveJitsiStopButton video={video} jitsi={jitsi}/>
            </React.Fragment>
          )}
          {video.live_state === liveState.STOPPED && (
            <Text>
              <FormattedMessage {...messages.liveStopped} />
            </Text>
          )}
          {video.live_state === liveState.STOPPING && (
            <Text>
              <FormattedMessage {...messages.liveStopping} />
            </Text>
          )}
      </Box>
    </Box>
  );
};
