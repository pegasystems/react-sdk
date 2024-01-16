import { withKnobs } from '@storybook/addon-knobs';

import { caseOpConfig } from './mock.stories';

import HmrcOdxGdsTaskList from './index.tsx';

export default {
  title: 'HmrcOdxGdsTaskList',
  decorators: [withKnobs],
  component: HmrcOdxGdsTaskList
};

if (!window.PCore) {
  window.PCore = {};
}

window.PCore.getDataApiUtils = () => {
  return {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    getData: (dataView, parameters, options) => {
      return new Promise(resolve => {
        if (dataView === 'D_pyStateList' && parameters.dataViewParameters.pyCountry === 'USA') {
          resolve({
            data: {
              data: [
                {
                  pyLabel: 'Alabama',
                  pyStateCode: 'AL'
                },
                {
                  pyLabel: 'Alaska',
                  pyStateCode: 'AK'
                }
              ]
            }
          });
        } else {
          resolve({
            data: {
              data: []
            }
          });
        }
      });
    }
  };
};

export const BaseHmrcOdxGdsTaskList = () => {
  const props = {
    countryList: {
      source: [
        {
          objectClass: 'Rule-Obj-FieldValue',
          value: 'United Kingdom',
          id: 'RULE-OBJ-FIELDVALUE @BASECLASS PYCOUNTRYCODE!GBR #20180713T132223.211 GMT',
          name: 'GBR'
        },
        {
          objectClass: 'Rule-Obj-FieldValue',
          value: 'United States',
          id: 'RULE-OBJ-FIELDVALUE @BASECLASS PYCOUNTRYCODE!USA #20180713T132225.795 GMT',
          name: 'USA'
        }
      ]
    },
    ...caseOpConfig,
    getPConnect: () => {
      return {
        getActionsApi: () => {
          return {
            updateFieldValue: () => {
              /* nothing */
            },
            triggerFieldChange: () => {
              /* nothing */
            }
          };
        },
        ignoreSuggestion: () => {
          /* nothing */
        },
        acceptSuggestion: () => {
          /* nothing */
        },
        setInheritedProps: () => {
          /* nothing */
        },
        resolveConfigProps: () => {
          /* nothing */
        }
      };
    }
  };

  return (
    <>
      <HmrcOdxGdsTaskList {...props} />
    </>
  );
};
