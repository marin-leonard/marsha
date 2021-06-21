import { Button } from 'grommet';
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
import { DashboardMountOnStageAskButton } from '../DashboardMountOnStageAskButton';
import { DashboardMountOnStageLeaveButton } from '../DashboardMountOnStageLeaveButton';
import DashboardVideoLiveJitsi from '../DashboardVideoLiveJitsi';

const messages = defineMessages({
  btnDashboard: {
    defaultMessage: 'Go to Dashboard',
    description: `Text for the button in the instructor view that allows the instructor to go to the dashboard.`,
    id: 'components.InstructorView.btnDashboard',
  },
  disabledDashboard: {
    defaultMessage:
      'This video is read-only because it belongs to another course: {lti_id}',
    description:
      'Text explaining that the ivdeo is in read_only mode and the dashboard is not available',
    id: 'components.InstructorView.disabledDashboard',
  },
  maintenance: {
    defaultMessage:
      "The dashboard is undergoing maintenance work, it can't be accessed right now.",
    description:
      'Text explaining that the dashboard is not accessible because marsha is in maintenance',
    id: 'components.InstructorView.maintenance',
  },
  title: {
    defaultMessage: 'Instructor Preview 👆',
    description: `Title for the Instructor View. Describes the area appearing right above, which is a preview
      of what the student will see there.`,
    id: 'components.InstructorView.title',
  },
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
        <DashboardMountOnStageLeaveButton video={resource} onClick={leaveStage} />}
      {resource.live_type && resource.live_type === LiveModeType.JITSI && !onStage &&
        (!asking ? <DashboardMountOnStageAskButton video={resource} onClick={() => setAsking(true)} /> : <p>Waiting for Instructor Response</p>)}
    </React.Fragment>
  );
};
