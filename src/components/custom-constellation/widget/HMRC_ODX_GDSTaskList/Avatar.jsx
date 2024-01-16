/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Avatar as CosmosAvatar } from '@pega/cosmos-react-core';

function Avatar(props) {
  const { metaObj, showStatus } = props;
  const [imageBlobUrl, setImageBlobUrl] = useState(null);
  let userName;
  let userIdentifier;

  // TODO Below if conditions can be removed once we have apis to get worklist/mywork info
  // This is non CaseView case (Dashboard, MyWork etc)
  if (!metaObj) {
    userName = PCore.getEnvironmentInfo().getOperatorName();
    userIdentifier = PCore.getEnvironmentInfo().getOperatorIdentifier();
  } else {
    userName = metaObj.name;
    userIdentifier = metaObj.ID;
  }
  if (!userName && userIdentifier) {
    userName = userIdentifier;
  }

  useEffect(() => {
    const imageKey = !metaObj ? PCore.getEnvironmentInfo().getOperatorImageInsKey() : metaObj.image;
    if (imageKey) {
      PCore.getAssetLoader()
        .getSvcImage(imageKey)
        .then((blob) => window.URL.createObjectURL(blob))
        .then((imagePath) => setImageBlobUrl(imagePath));
    }
  }, []);

  if (showStatus) {
    const currentState = PCore.getMessagingServiceManager().getUserPresence().getUserState(userIdentifier);
    const [userState, setUserState] = useState(currentState === 'online' ? 'active' : 'inactive');

    const handleUserStateChange = ({ state }) => {
      setUserState(state === 'online' ? 'active' : 'inactive');
    };

    useEffect(() => {
      const subId = PCore.getMessagingServiceManager()
        .getUserPresence()
        .subscribe(userIdentifier, handleUserStateChange);

      return function cleanup() {
        PCore.getMessagingServiceManager().getUserPresence().unsubscribe(userIdentifier, subId);
      };
    }, []);
    return <CosmosAvatar name={userName} imageSrc={imageBlobUrl} status={userState} />;
  }

  // Do not render when userName does not exists
  // TODO : In CNR case, pxRequestor is not available, please remove this condition once it populates
  if (!userName) {
    return null;
  }

  return <CosmosAvatar name={userName} imageSrc={imageBlobUrl} />;
}

Avatar.propTypes = {
  metaObj: PropTypes.objectOf(PropTypes.any),
  showStatus: PropTypes.bool
};

Avatar.defaultProps = {
  metaObj: null,
  showStatus: false
};

export default Avatar;
