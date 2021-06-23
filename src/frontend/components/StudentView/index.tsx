import { Box, Button } from 'grommet';
import { normalizeColor } from 'grommet/utils';
import React, { useEffect, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { appData, getDecodedJwt } from '../../data/appData';
import { theme } from '../../utils/theme/theme';
import { DASHBOARD_ROUTE } from '../Dashboard/route';
import { withLink } from '../withLink/withLink';
import { Document } from '../../types/file';
import { LiveModeType, Video } from '../../types/tracks';
import { DashboardJoinDiscussionAskButton } from '../DashboardJoinDiscussionAskButton';
import { DashboardJoinDiscussionLeaveButton } from '../DashboardJoinDiscussionLeaveButton';
import DashboardVideoLiveJitsi from '../DashboardVideoLiveJitsi';

const messages = defineMessages({
  waitingInstructor: {
    defaultMessage: 'Waiting for Instructor response',
    description: `Text that replace the JoinDiscussion button before the instructor response.`,
    id: 'components.StudentView.waitingInstructor',
  }
});

interface StudentViewProps {
  children: React.ReactNode;
  resource: any;
}

export const StudentView = ({ children, resource }: StudentViewProps) => {
  
  const [onStage, setOnStage] = useState(false);
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    window.addEventListener('accepted', (params: any) => {
      setOnStage(true);
    })
    window.addEventListener('rejected', (params: any) => {
      setAsking(false);
    })
    window.addEventListener('kicked', (params: any) => {
      setAsking(false);
      setOnStage(false);
    })
  }, [])

  const leaveStage = () => {
    setAsking(false);
    setOnStage(false);
  }

  return (
    <React.Fragment>
      {resource.live_type && resource.live_type === LiveModeType.JITSI ? (
        onStage ? <DashboardVideoLiveJitsi video={resource} /> : children
      ) : children}
      {resource.live_type && resource.live_type === LiveModeType.JITSI && onStage && 
          <Box direction='row' margin='small' alignContent='center' justify="center">
            <DashboardJoinDiscussionLeaveButton video={resource} onClick={leaveStage} />
          </Box>
      }
      {resource.live_type && resource.live_type === LiveModeType.JITSI && !onStage &&
        (
          <Box direction='row' margin='small' alignContent='center' justify="center">
            {!asking ? <DashboardJoinDiscussionAskButton video={resource} onClick={() => setAsking(true)} /> : <FormattedMessage {...messages.waitingInstructor} />}
          </Box>
        )}
    </React.Fragment>
  );
};
