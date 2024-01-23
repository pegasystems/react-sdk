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
        if (dataView === 'D_CaseTaskList') {
          resolve({
            data: {
              caseInfo: {
                content: {
                  CaseTasks: {
                    CaseTaskList: [
                      {
                        TaskLabel: 'Your details',
                        TaskStatus: 'Completed'
                      },
                      {
                        TaskLabel: 'Relationship details',
                        TaskStatus: 'In progress'
                      },
                      {
                        TaskLabel: 'Child details',
                        TaskStatus: 'Cannot start yet'
                      },
                      {
                        TaskLabel: 'Income details',
                        TaskStatus: 'Cannot start yet'
                      }
                    ]
                  }
                }
              }
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
