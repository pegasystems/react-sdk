import { useState } from 'react';

import { withKnobs } from '@storybook/addon-knobs';

import HmrcOdxGdsCheckAnswersPage from './index.tsx';

export default {
  title: 'HmrcOdxGdsCheckAnswersPage',
  decorators: [withKnobs],
  component: HmrcOdxGdsCheckAnswersPage
};

if (!window.PCore) {
  window.PCore = {};
}

window.PCore.getErrorHandler = () => {
    return {
      getGenericFailedMessage() {
        /* nothing */
      }
    };
};

window.PCore.getConstants = () => {
  return {
    CASE_INFO: {
      INSTRUCTIONS: ""
    }
  }
};

export const BaseHmrcOdxGdsCheckAnswersPage = () => {

  const [firstName, setFirstName] = useState('John');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('Joe');
  const [phone, setPhone] = useState('+16397975093');
  const [suffix, setSuffix] = useState('');
  const [email, setEmail] = useState('john@doe.com');

  const props = {
    NumCols: "1",
    template: 'DefaultForm',

     getPConnect: () => {
      return {
        getChildren: () => {
          return [
            {
              getPConnect: () => {
                return {
                  getChildren: () => {
                    return [
                      {
                        readOnly: undefined,
                        placeholder: 'First Name',
                        value: firstName,
                        label: 'First Name',
                        hasSuggestions: false,
                        onChange: val => {
                          setFirstName(val.target.value);
                        },
                        getPConnect: () => {
                          return {
                            getActionsApi: () => {
                              return {
                                updateFieldValue: () => {/* nothing */},
                                triggerFieldChange: () => {/* nothing */}
                              };
                            },
                            getStateProps: () => {
                              return { value: '.firstname' };
                            }
                          };
                        }
                      },
                      {
                        readOnly: undefined,
                        placeholder: 'Middle Name',
                        value: middleName,
                        label: 'Middle Name',
                        hasSuggestions: false,
                        onChange: val => {
                          setMiddleName(val.target.value);
                        },
                        getPConnect: () => {
                          return {
                            getActionsApi: () => {
                              return {
                                updateFieldValue: () => {/* nothing */},
                                triggerFieldChange: () => {/* nothing */}
                              };
                            },
                            getStateProps: () => {
                              return { value: '.middlename' };
                            }
                          };
                        }
                      },

                      {
                        value: lastName,
                        label: 'Last Name',
                        required: true,
                        placeholder: 'Last Name',
                        testId: '77587239BF4C54EA493C7033E1DBF636',
                        hasSuggestions: false,
                        onChange: val => {
                          setLastName(val.target.value);
                        },
                        getPConnect: () => {
                          return {
                            getActionsApi: () => {
                              return {
                                updateFieldValue: () => {/* nothing */},
                                triggerFieldChange: () => {/* nothing */}
                              };
                            },
                            getStateProps: () => {
                              return { value: '.lastname' };
                            }
                          };
                        }
                      },

                      {
                        readOnly: undefined,
                        value: phone,
                        label: 'Phone Number',
                        datasource: {
                          fields: {
                            value: undefined
                          },
                          source: [
                            {
                              value: '+1'
                            },
                            {
                              value: '+91'
                            },
                            {
                              value: '+48'
                            },
                            {
                              value: '+44'
                            }
                          ]
                        },
                        hasSuggestions: false,
                        onChange: val => {
                          setPhone(val.value);
                        },
                        onBlur: () => {
                          /* nothing */
                        }
                      },

                      {
                        value: suffix,
                        label: 'Suffix',
                        placeholder: 'Select...',
                        listType: 'associated',
                        datasource: [
                          {
                            key: 'Sr',
                            value: 'Sr'
                          },
                          {
                            key: 'Jr',
                            value: 'Jr'
                          },
                          {
                            key: 'III',
                            value: 'III'
                          },
                          {
                            key: 'IV',
                            value: 'IV'
                          },
                          {
                            key: 'V',
                            value: 'V'
                          }
                        ],
                        testId: '56E6DDD1CB6CEC596B433440DFB21C17',
                        hasSuggestions: false,
                        deferDatasource: false,
                        getPConnect: () => {
                          return {
                            getContextName: () => {
                              return null;
                            },
                            getDataObject: () => {
                              return null;
                            },
                            getActionsApi: () => {
                              return {
                                updateFieldValue: (propName, value) => {
                                  setSuffix(value);
                                },
                                triggerFieldChange: () => {
                                  /* nothing */
                                }
                              };
                            },
                            getStateProps: () => {
                              return {
                                value: ''
                              };
                            }
                          };
                        },
                        onChange: val => {
                          setSuffix(val.target.value);
                        }
                      },

                      {
                        value: email,
                        label: 'Email',
                        required: true,
                        testId: 'CE8AE9DA5B7CD6C3DF2929543A9AF92D',
                        hasSuggestions: false,
                        onChange: val => {
                          setEmail(val.target.value);
                        }
                      }
                    ];
                  }
                };
              }
            }
          ];
        },
        getValue: (val) => {
          return val;
        },
        getCurrentView: () => {
          return "";
        },
        getCurrentClassID: () => {
          return "";
        }
      };
    }
  };

  return (
    <>
      <HmrcOdxGdsCheckAnswersPage {...props}></HmrcOdxGdsCheckAnswersPage>
    </>
  );
};
