import { Button } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { buildFilePropsFromResponse, getIconFromFileType, validateMaxSize, getIconForAttachment } from './AttachmentUtils';
import './Attachment.css';
import SummaryList from '../widgets/SummaryList'
import { CircularProgress } from "@material-ui/core";
import download from "downloadjs";

declare const PCore: any;

function getCurrentAttachmentsList(context) {
  return PCore.getStoreValue('.attachmentsList', 'context_data', context) || [];
}

export default function Attachment(props) {
  const {value, getPConnect, label} = props;
  /* this is a temporary fix because required is supposed to be passed as a boolean and NOT as a string */
  let { required, disabled } = props;
  [required, disabled] = [required, disabled].map(
    prop => prop === true || (typeof prop === 'string' && prop === 'true')
  );
  let arFileList$: Array<any> = [];
  const pConn = getPConnect();

  let fileTemp: any = {};

  let categoryName = '';
  if (value && value.pyCategoryName) {
    categoryName = value.pyCategoryName;
  }

  let valueRef = pConn.getStateProps().value;
  valueRef = valueRef.indexOf('.') === 0 ? valueRef.substring(1) : valueRef;
  const [file, setFile] = useState(fileTemp);

  const fileDownload = (data, fileName, ext) => {
    const fileData = ext ? `${fileName}.${ext}` : fileName;
    download(atob(data), fileData);
  };

  function _downloadFileFromList(fileObj: any) {
    PCore.getAttachmentUtils()
      .downloadAttachment(fileObj.pzInsKey, pConn.getContextName())
      .then((content) => {
        const extension = fileObj.pyAttachName.split(".").pop();
        fileDownload(content.data, fileObj.pyFileName, extension);
      })
      .catch(() => {});
  }

  function setNewFiles(arFiles) {
    let index = 0;
    for (const item of arFiles) {
      if (!validateMaxSize(item, 5)) {
        item.error = true;
        item.meta = "File is too big. Max allowed size is 5MB.";
      }
      item.mimeType = item.type;
      item.icon = getIconFromFileType(item.type);
      item.ID = `${new Date().getTime()}I${index}`;
      index+=1;
    }
    return arFiles;
  }

  function getFiles(arFiles: Array<any>) {
    return setNewFiles(arFiles);
  }

  function getNewListUtilityItemProps({
    att,
    cancelFile,
    downloadFile,
    deleteFile,
    removeFile
  }) {
    let actions;
    if (att.progress && att.progress !== 100) {
      actions = [
        {
          id: `Cancel-${att.ID}`,
          text: "Cancel",
          icon: "times",
          onClick: cancelFile
        }
      ];
    } else if (att.links) {
      const isFile = att.type === "FILE";
      const ID = att.ID.replace(/\s/gi, "");
      const actionsMap = new Map([
        [
          "download",
          {
            id: `download-${ID}`,
            text: isFile ? "Download" : "Open",
            icon: isFile ? "download" : "open",
            onClick: downloadFile
          }
        ],
        [
          "delete",
          {
            id: `Delete-${ID}`,
            text: "Delete",
            icon: "trash",
            onClick: deleteFile
          }
        ]
      ]);
      actions = [];
      actionsMap.forEach((action, actionKey) => {
        if (att.links[actionKey]) {
          actions.push(action);
        }
      });
    } else if (att.error) {
      actions = [
        {
          id: `Remove-${att.ID}`,
          text: "Remove",
          icon: "trash",
          onClick: removeFile
        }
      ];
    }
    return  {
      id: att.ID,
      visual: {
        icon: getIconForAttachment(att),
        progress: att.progress === 100 ? undefined: att.progress,
      },
      primary: {
        type: att.type,
        name: att.name,
        icon: "trash",
        click: removeFile,
      },
      secondary: {
        text: att.meta
      },
      actions
    };
  };

  const onFileAdded = (event) => {
   const addedFile = event.target.files[0];
    setFile({
      props: {
        name: addedFile.name,
        icon: getIconFromFileType(addedFile.type),
      },
      inProgress: true
    });
    const arFiles$ = getFiles(event.target.files);
    const myFiles: any = Array.from(arFiles$);

    const onUploadProgress = () => {};

    const errorHandler = () => {};

    PCore.getAttachmentUtils()
      .uploadAttachment(
        myFiles[0],
        onUploadProgress,
        errorHandler,
        pConn.getContextName()
      )
      .then((fileRes) => {
        let reqObj;
        if (PCore.getPCoreVersion()?.includes('8.7')) {
          reqObj = {
            type: "File",
            attachmentFieldName: valueRef,
            category: categoryName,
            ID: fileRes.ID
          };
          pConn.attachmentsInfo = reqObj;
        } else {
          reqObj = {
            type: "File",
            label: valueRef,
            category: categoryName,
            handle: fileRes.ID,
            ID: fileRes.clientFileID
          };
          PCore.getStateUtils().updateState(
            pConn.getContextName(),
            'attachmentsList',
            [reqObj],
            {
              pageReference: 'context_data',
              isArrayDeepMerge: false
            }
          );
        }
        const fieldName = pConn.getStateProps().value;
        const context = pConn.getContextName();

        PCore.getMessageManager().clearMessages({
          type: PCore.getConstants().MESSAGES.MESSAGES_TYPE_ERROR,
          property: fieldName,
          pageReference: pConn.getPageReference(),
          context
        });
        myFiles[0].meta = "Uploaded Successfully";

        arFileList$ = myFiles.map((att) => {
          return getNewListUtilityItemProps({
            att,
            downloadFile: null,
            cancelFile: null,
            deleteFile: null,
            removeFile: null
          });
        });
        setFile((current) => {
          return {
            ...current,
            props: {
              ...current.props,
              arFileList$
            },
            inProgress: false,
            attachmentUploaded: true,
            showMenuIcon: false
          };
        });
      })

      .catch(() => {
        // just catching the rethrown error at uploadAttachment
        // to handle Unhandled rejections
      });
  };

  function _removeFileFromList(item: any, list) {
    const arFileList = file.props ? file.props.arFileList$ : list;
    const fileIndex = arFileList.findIndex(element => element?.id === item?.id);
    if (PCore.getPCoreVersion()?.includes('8.7')) {
      if (value && value.pxResults[0]) {
        pConn.attachmentsInfo = {
          type: "File",
          attachmentFieldName: valueRef,
          delete: true
        };
      }
      if (fileIndex > -1) { arFileList.splice(parseInt(fileIndex, 10), 1) };
      setFile((current) => {
        return {
          ...current,
          props: {
            ...current.props,
            arFileList
          },
        };
      });
    } else {
      const attachmentsList = [];
      const currentAttachmentList = getCurrentAttachmentsList(pConn.getContextName()).filter(
        (f) => f.label !== valueRef
      );
      if (value && value.pxResults && +value.pyCount > 0) {
        const deletedFile = {
          type: "File",
          label: valueRef,
          delete: true,
          responseProps: {
            pzInsKey: arFileList[fileIndex].id
          },
        };
        // updating the redux store to help form-handler in passing the data to delete the file from server
        PCore.getStateUtils().updateState(
          pConn.getContextName(),
          'attachmentsList',
          [...currentAttachmentList, deletedFile],
          {
            pageReference: 'context_data',
            isArrayDeepMerge: false
          }
        );
      } else {
        PCore.getStateUtils().updateState(
          pConn.getContextName(),
          'attachmentsList',
          [...currentAttachmentList, ...attachmentsList],
          {
            pageReference: 'context_data',
            isArrayDeepMerge: false
          }
        );
      }
      if (fileIndex > -1) { arFileList.splice(parseInt(fileIndex, 10), 1) };
      setFile((current) => {
        return {
          ...current,
          props: {
            ...current.props,
            arFileList
          },
        };
      });
    }
  }

  useEffect(() => {
    if (value && value.pxResults && +value.pyCount > 0) {
    fileTemp = buildFilePropsFromResponse(value.pxResults[0]);

    if (fileTemp.responseProps) {
      if (!pConn.attachmentsInfo) {
        pConn.attachmentsInfo = {
          type: "File",
          attachmentFieldName: valueRef,
          category: categoryName
        };
      }

      if (fileTemp.responseProps.pzInsKey && !fileTemp.responseProps.pzInsKey.includes("temp")) {

        fileTemp.props.type = fileTemp.responseProps.pyMimeFileExtension;
        fileTemp.props.mimeType = fileTemp.responseProps.pyMimeFileExtension;
        fileTemp.props.ID = fileTemp.responseProps.pzInsKey;
        // create the actions for the "more" menu on the attachment
        const arMenuList: Array<any> = [];
        let oMenu: any = {};

        oMenu.icon = "download";
        oMenu.text = "Download";
        oMenu.onClick = () => { _downloadFileFromList(value.pxResults[0])}
        arMenuList.push(oMenu);
        oMenu = {};
        oMenu.icon = "trash";
        oMenu.text = "Delete";
        oMenu.onClick = () => { _removeFileFromList(arFileList$[0], arFileList$)}
        arMenuList.push(oMenu);

        arFileList$.push(getNewListUtilityItemProps({
          att: fileTemp.props,
          downloadFile: null,
          cancelFile: null,
          deleteFile: null,
          removeFile: null
        }));
        arFileList$[0].actions = arMenuList;

        setFile((current) => {
          return {
            ...current,
            props: {
              ...current.props,
              arFileList$
            },
            inProgress: false,
            attachmentUploaded: true,
            showMenuIcon: true
          };
        });
      }
    }
  }
  }, [""]);

  let content = (
    <div className='file-div'>
        {file.inProgress && (<div className="progress-div"><CircularProgress /></div>)}
        <label htmlFor='upload-input'>
          <input
            style={{ display: 'none' }}
            id='upload-input'
            name='upload-photo'
            type='file'
            required={required}
            onChange={onFileAdded}
          />
          <Button variant='outlined' color='primary' component="span">
            Upload file
          </Button>
        </label>
    </div>
  );

  if (file && file.attachmentUploaded && file.props.arFileList$ && file.props.arFileList$.length > 0) {
    content = (
      <div>
         {file.showMenuIcon && (<SummaryList arItems$={file.props.arFileList$} menuIconOverrideAction$={_removeFileFromList}></SummaryList>)}
         {!file.showMenuIcon && (<SummaryList menuIconOverride$='trash' arItems$={file.props.arFileList$} menuIconOverrideAction$={_removeFileFromList}></SummaryList>)}
      </div>

    );
  }

  return (
    <div className='file-upload-container'>
      <span className='label'>{label}</span>
      <section>{content}</section>
    </div>
  );
}
