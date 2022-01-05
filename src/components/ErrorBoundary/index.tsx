// Adapted from nebula ErrorBoundary (remove Cosmos dependencies)

import React from "react";
import PropTypes from "prop-types";

declare const PCore;

function ErrorBoundary(props) {
  const ERROR_TEXT = PCore.getErrorHandler().getGenericFailedMessage();
  const WORK_AREA = "workarea";
  const ERROR_WHILE_RENDERING = "ERROR_WHILE_RENDERING";
  const { getPConnect, isInternalError } = props;

  const theErrorDiv = <div>{ERROR_TEXT}</div>

  if (!getPConnect) {
    return (
      theErrorDiv
      // <Flex
      //   container={{
      //     alignItems: "center",
      //     justify: "center",
      //     itemGap: 1
      //   }}
      // >
      //   <Text status="error">
      //     <Icon name="warn-solid" />
      //   </Text>
      //   <Text data-testid="errorText">{ERROR_TEXT}</Text>
      // </Flex>
    );
  }

  const pConn = getPConnect();

  if (!isInternalError) {
    // eslint-disable-next-line no-console
    console.error(`Unable to load the component ${pConn.getComponentName()}
    This might be due to the view meta data getting corrupted or the component file missing.
    Raw meta data for the component: ${JSON.stringify(pConn.getRawMetadata())}`);
  }

  if (pConn.getConfigProps().type === "page") {
    return (
      theErrorDiv
      // <Banner
      //   data-testid="errorBanner"
      //   variant="urgent"
      //   heading="Error"
      //   messages={[ERROR_TEXT]}
      // />
    );
  }

  if (
    pConn.getContainerName() === WORK_AREA ||
    pConn.isInsideList() === true ||
    pConn.getContainerName() === "modal"
  ) {
    const { publish } = PCore.getPubSubUtils();
    publish(ERROR_WHILE_RENDERING);
    return null;
  }

  return (
    theErrorDiv
    // <Card>
    //   <CardHeader>
    //     <Text variant="h3">
    //       {pConn.getConfigProps().label || pConn.getComponentName()}
    //     </Text>
    //   </CardHeader>
    //   <CardContent
    //     direction="row"
    //     style={{ minHeight: "5rem", justifyContent: "center" }}
    //   >
    //     <Flex
    //       container={{
    //         alignItems: "center",
    //         justify: "center",
    //         itemGap: 1
    //       }}
    //     >
    //       <Text status="error">
    //         <Icon name="warn-solid" />
    //       </Text>
    //       <Text>{ERROR_TEXT}</Text>
    //     </Flex>
    //   </CardContent>
    // </Card>
  );
}
ErrorBoundary.propTypes = {
  getPConnect: PropTypes.func,
  isInternalError: PropTypes.bool
};

ErrorBoundary.defaultProps = {
  getPConnect: null,
  isInternalError: false
};

export default ErrorBoundary;
