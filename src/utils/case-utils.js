import React from 'react';
import AlertBanner from '../components/designSystemExtensions/AlertBanner';

/**
 * Function that accepts array of messages as input and group them by their type and returns the resulting object
 * @param {Array} inputMessages
 * Eg: [
 * {message: 'First Name is required', type: 'error'},
 * {message: 'Last Name is required', type: 'error'},
 * {message: 'Address field should be clear and precise', type: 'info'}
 * ]
 *
 * @returns {object}
 *
 * Eg: {
 *  error: ['First Name is required', 'Last Name is required'],
 *  info: ['Address field should be clear and precise']
 * }
 */

function getMessagesGrouped(inputMessages) {
  const messages = {};

  if (inputMessages && inputMessages instanceof Array && inputMessages.length > 0) {
    inputMessages.forEach(item => {
      const { message, type } = item;
      messages[type] = [...(messages[type] || []), message];
    });
  }
  return messages;
}

/**
 * Function accepts a error type and variant of the banner
 * @param {string} type
 * Eg: 'error'
 * @returns {string}
 * Eg: 'urgent'
 */
function getVariant(type) {
  const { BANNER_VARIANT_SUCCESS, BANNER_VARIANT_INFO, BANNER_VARIANT_URGENT, MESSAGES } =
    PCore.getConstants();
  const { MESSAGES_TYPE_ERROR, MESSAGES_TYPE_INFO, MESSAGES_TYPE_SUCCESS } = MESSAGES;

  let variant;
  switch (type) {
    case MESSAGES_TYPE_ERROR:
      variant = BANNER_VARIANT_URGENT;
      break;
    case MESSAGES_TYPE_INFO:
      variant = BANNER_VARIANT_INFO;
      break;
    case MESSAGES_TYPE_SUCCESS:
      variant = BANNER_VARIANT_SUCCESS;
      break;
    default:
      variant = '';
  }
  return variant;
}

function getBanners(config) {
  const { target, pageMessages, httpMessages } = config;
  const { PAGE } = PCore.getConstants();
  const { clearMessages } = PCore.getMessageManager();
  const banners = [];
  const groupedPageMessages = getMessagesGrouped(pageMessages);

  Object.keys(groupedPageMessages).forEach(type => {
    const messagesByType = groupedPageMessages[type];
    const variant = getVariant(type);
    const pageMessagesBannerID = `${target}_${PAGE}_${type}`.toLowerCase().replace('/', '_');
    banners.push(
      <AlertBanner
        id={pageMessagesBannerID}
        variant={variant}
        messages={messagesByType}
        onDismiss={
          variant === 'urgent'
            ? ''
            : () => {
                clearMessages({
                  category: PAGE,
                  type,
                  context: target
                });
              }
        }
      />
    );
  });

  if (httpMessages && httpMessages.length > 0) {
    banners.push(
      <AlertBanner id='modalViewContainerBanner' variant='urgent' messages={httpMessages} />
    );
  }

  return banners;
}

export { getMessagesGrouped, getBanners };
