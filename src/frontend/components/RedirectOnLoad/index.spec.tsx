import { cleanup, render } from '@testing-library/react';
import * as React from 'react';

import { AppState } from '../../types/AppData';
import { ModelName } from '../../types/models';
import { UploadState } from '../../types/tracks';
import { wrapInRouter } from '../../utils/tests/router';
import { DASHBOARD_ROUTE } from '../Dashboard/route';
import { ERROR_COMPONENT_ROUTE } from '../ErrorComponent/route';
import { PLAYER_ROUTE } from '../routes';
import { RedirectOnLoad } from './index';

let mockState: any;
let mockVideo: any;
let mockDocument: any;
let mockModelName: any;
let mockCanUpdate: boolean;
jest.mock('../../data/appData', () => ({
  appData: {
    get isEditable() {
      return mockCanUpdate;
    },
    get state() {
      return mockState;
    },
    get video() {
      return mockVideo;
    },
    get document() {
      return mockDocument;
    },
    get modelName() {
      return mockModelName;
    },
  },
  getDecodedJwt: () => ({
    permissions: {
      can_update: mockCanUpdate,
    },
  }),
}));

describe('<RedirectOnLoad />', () => {
  beforeEach(jest.resetAllMocks);

  it('redirects users to the error view on LTI error', () => {
    mockState = AppState.ERROR;
    mockVideo = null;
    mockDocument = null;
    mockModelName = ModelName.VIDEOS;

    const { getByText } = render(
      wrapInRouter(<RedirectOnLoad />, [
        {
          path: ERROR_COMPONENT_ROUTE(),
          render: ({ match }) => (
            <span>{`Error Component: ${match.params.code}`}</span>
          ),
        },
      ]),
    );

    getByText('Error Component: lti');
  });

  it('redirects users to the error view when there is no resource', () => {
    mockState = AppState.SUCCESS;
    mockVideo = null;
    mockDocument = null;
    mockModelName = ModelName.VIDEOS;

    const { getByText } = render(
      wrapInRouter(<RedirectOnLoad />, [
        {
          path: ERROR_COMPONENT_ROUTE(),
          render: ({ match }) => (
            <span>{`Error Component: ${match.params.code}`}</span>
          ),
        },
      ]),
    );

    getByText('Error Component: notFound');
  });

  it('redirects users to the player when the video can be shown', () => {
    mockState = AppState.SUCCESS;
    mockModelName = ModelName.VIDEOS;
    mockDocument = null;
    mockCanUpdate = false;
    Object.values(UploadState).forEach((state) => {
      mockVideo = { is_ready_to_show: true, upload_state: state };
      const { getByText } = render(
        wrapInRouter(<RedirectOnLoad />, [
          {
            path: PLAYER_ROUTE(ModelName.VIDEOS),
            render: () => <span>video player</span>,
          },
        ]),
      );

      getByText('video player');
      cleanup();
    });
  });

  it('redirects users to the player when the document can be shown', () => {
    mockState = AppState.SUCCESS;
    mockModelName = ModelName.DOCUMENTS;
    mockVideo = null;
    mockCanUpdate = false;

    Object.values(UploadState).forEach((state) => {
      mockDocument = { is_ready_to_show: true, upload_state: state };
      const { getByText } = render(
        wrapInRouter(<RedirectOnLoad />, [
          {
            path: PLAYER_ROUTE(ModelName.DOCUMENTS),
            render: () => <span>document player</span>,
          },
        ]),
      );

      getByText('document player');
      cleanup();
    });
  });

  it('redirects users to /dashboard when video is not ready to be shown and it has permissions to update it', () => {
    mockState = AppState.SUCCESS;
    mockVideo = {
      is_ready_to_show: false,
      upload_state: UploadState.PROCESSING,
    };
    mockModelName = ModelName.VIDEOS;
    mockDocument = null;
    mockCanUpdate = true;

    const { getByText } = render(
      wrapInRouter(<RedirectOnLoad />, [
        {
          path: DASHBOARD_ROUTE(),
          render: ({ match }) => (
            <span>{`dashboard ${match.params.objectType}`}</span>
          ),
        },
      ]),
    );

    getByText('dashboard videos');
  });

  it('redirects users to /dashboard when document is not ready to be shown and it has permissions to update it', () => {
    mockState = AppState.SUCCESS;
    mockDocument = {
      is_ready_to_show: false,
      upload_state: UploadState.PROCESSING,
    };
    mockModelName = ModelName.DOCUMENTS;
    mockVideo = null;
    mockCanUpdate = true;

    const { getByText } = render(
      wrapInRouter(<RedirectOnLoad />, [
        {
          path: DASHBOARD_ROUTE(),
          render: ({ match }) => (
            <span>{`dashboard ${match.params.objectType}`}</span>
          ),
        },
      ]),
    );

    getByText('dashboard documents');
  });

  it('redirects users to /error when video is not ready to be shown and it has no permissions to update it', () => {
    mockState = AppState.SUCCESS;
    mockVideo = {
      is_ready_to_show: false,
      upload_state: UploadState.PROCESSING,
    };
    mockModelName = ModelName.VIDEOS;
    mockDocument = null;
    mockCanUpdate = false;

    const { getByText } = render(
      wrapInRouter(<RedirectOnLoad />, [
        {
          path: ERROR_COMPONENT_ROUTE(),
          render: ({ match }) => (
            <span>{`Error Component: ${match.params.code}`}</span>
          ),
        },
      ]),
    );

    getByText('Error Component: notFound');
  });

  it('redirects users to /error when document is not ready to be shown and it has no permissions to update it', () => {
    mockState = AppState.SUCCESS;
    mockDocument = {
      is_ready_to_show: false,
      upload_state: UploadState.PROCESSING,
    };
    mockModelName = ModelName.DOCUMENTS;
    mockVideo = null;
    mockCanUpdate = false;

    const { getByText } = render(
      wrapInRouter(<RedirectOnLoad />, [
        {
          path: ERROR_COMPONENT_ROUTE(),
          render: ({ match }) => (
            <span>{`Error Component: ${match.params.code}`}</span>
          ),
        },
      ]),
    );

    getByText('Error Component: notFound');
  });
});
