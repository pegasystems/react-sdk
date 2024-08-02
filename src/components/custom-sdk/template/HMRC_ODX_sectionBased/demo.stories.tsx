import React, { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import HmrcOdxSectionBased from './index';

window.PCore = {
  ...window.PCore,
  getErrorHandler: (): any => {
    return {
      getGenericFailedMessage() {
        /* nothing */
      }
    };
  },
  getConstants: (): any => {
    return {
      CASE_INFO: {
        INSTRUCTIONS: ''
      }
    };
  }
};

const meta: Meta<typeof HmrcOdxSectionBased> = {
  title: 'HmrcOdxSectionBased',
  component: HmrcOdxSectionBased,
  excludeStories: /.*Data$/,
  parameters: {
    type: 'Form'
  }
};

export default meta;
type Story = StoryObj<typeof HmrcOdxSectionBased>;

export const BaseHmrcOdxSectionBased: Story = args => {
  const [firstName, setFirstName] = useState('John');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('Joe');
  const [phone, setPhone] = useState('+16397975093');
  const [suffix, setSuffix] = useState('');
  const [email, setEmail] = useState('john@doe.com');

  const props = {
    NumCols: '1',
    template: 'sectionBased',

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
                                updateFieldValue: () => {
                                  /* nothing */
                                },
                                triggerFieldChange: () => {
                                  /* nothing */
                                }
                              };
                            },
                            getStateProps: () => {
                              return { value: '.firstname' };
                            },
                            getComputedVisibility: () => {
                              return true;
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
                                updateFieldValue: () => {
                                  /* nothing */
                                },
                                triggerFieldChange: () => {
                                  /* nothing */
                                }
                              };
                            },
                            getStateProps: () => {
                              return { value: '.middlename' };
                            },
                            getComputedVisibility: () => {
                              return true;
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
                                updateFieldValue: () => {
                                  /* nothing */
                                },
                                triggerFieldChange: () => {
                                  /* nothing */
                                }
                              };
                            },
                            getStateProps: () => {
                              return { value: '.lastname' };
                            },
                            getComputedVisibility: () => {
                              return true;
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
                        },
                        getPConnect: () => {
                          return {
                            getComputedVisibility: () => {
                              return true;
                            }
                          };
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
                            },
                            getComputedVisibility: () => {
                              return true;
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
                        },
                        getPConnect: () => {
                          return {
                            getComputedVisibility: () => {
                              return true;
                            }
                          };
                        }
                      }
                    ];
                  }
                };
              }
            }
          ];
        },
        getValue: val => {
          return val;
        },
        getCurrentView: () => {
          return '';
        },
        getCurrentClassID: () => {
          return '';
        }
      };
    }
  };

  return <HmrcOdxSectionBased {...props} {...args} />;
};

BaseHmrcOdxSectionBased.args = {};
