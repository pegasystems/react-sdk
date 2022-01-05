import React, { Children } from "react";
import PropTypes from "prop-types";

// import { TwoColumnPage as TwoColumn } from "@pega/cosmos-react-core";
import NarrowWide from '../NarrowWide';

/*
 * The wrapper handles knowing how to take in just children and mapping
 * to the Cosmos template.
 */
export default function NarrowWidePage(props) {
  const { children, title, templateCol, icon } = props;
  const childArray = Children.toArray(children);

  return (
    <div>
    <NarrowWide
        a={childArray[0]}
        b={childArray[1]}
        title={title}
        cols={templateCol}
        icon={icon?.replace("pi pi-", "")}
      />
    </div>
  );
}

NarrowWidePage.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  title: PropTypes.string.isRequired,
  templateCol: PropTypes.string,
  icon: PropTypes.string
};

NarrowWidePage.defaultProps = {
  templateCol: "1fr 1fr",
  icon: ""
};
