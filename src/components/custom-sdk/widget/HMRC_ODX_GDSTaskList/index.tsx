import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Text,
  StandardTree,
  treeHelpers
} from '@pega/cosmos-react-core';

import StyledHmrcOdxGdsTaskListWrapper from './styles';
import type { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';
import PropTypes from 'prop-types';

interface HmrcOdxGdsTaskListProps extends PConnProps {
  // If any, enter additional props that only exist on this componentName
  // eslint-disable-next-line react/no-unused-prop-types
  label: string;
  headerText: '';
  countryList: {};
}

const createCountryNodes = countryList => {
  const isParent = true;
  let nodes = [];
  nodes = countryList.source?.map(country => {
    return {
      id: country.name,
      label: country.value,
      icon: isParent ? 'folder-solid' : 'document-solid',
      nodes: isParent ? [] : undefined
    };
  });
  return nodes;
};

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export default function HmrcOdxGdsTaskList(props: HmrcOdxGdsTaskListProps) {
  const { headerText, countryList } = props;

  const [currentNodeId, setCurrentNodeId] = useState();
  const [allNodes, setAllNodes] = useState(createCountryNodes(countryList));

  const getStates = id => {
    PCore.getDataApiUtils()
      .getData('D_pyStateList', {
        dataViewParameters: { pyCountry: id }
      })
      .then(response => {
        const nodes = response.data?.data.map(state => {
          const isParent = false;
          return {
            id: state.pyStateCode,
            label: state.pyLabel,
            icon: isParent ? 'folder-solid' : 'document-solid',
            nodes: isParent ? [] : undefined
          };
        });
        setAllNodes(tree => {
          return treeHelpers.mapNode(tree, id, node => {
            return {
              ...node,
              loading: false,
              nodes: [...(node.nodes ?? []), ...nodes]
            };
          });
        });
      })
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      .catch(e => {
        // Handle error
      });
  };

  return (
    <StyledHmrcOdxGdsTaskListWrapper>
      <Card>
        <CardHeader>
          <Text variant='h2'>{headerText}</Text>
        </CardHeader>
        <CardContent>
          <StandardTree
            lined={false}
            currentNodeId={currentNodeId}
            nodes={allNodes}
            onNodeClick={id => {
              const clickedNode = treeHelpers.getNode(allNodes, id);
              // @ts-ignore
              setCurrentNodeId(id);
              if (!clickedNode?.nodes) return;
              setAllNodes(tree =>
                treeHelpers.mapNode(tree, id, node => {
                  return {
                    ...node,
                    expanded: !node.expanded,
                    loading: node.nodes?.length === 0
                  };
                })
              );
              if (clickedNode?.nodes?.length > 0) return;
              getStates(id);
            }}
          />
        </CardContent>
      </Card>
    </StyledHmrcOdxGdsTaskListWrapper>
  );
}

HmrcOdxGdsTaskList.propTypes = {
  headerText: PropTypes.string,
  countryList: PropTypes.instanceOf(Object)
};
