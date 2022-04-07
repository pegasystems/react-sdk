import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { buildFilePropsFromResponse, getIconFromFileType, validateMaxSize, getIconForAttachment } from './AttachmentUtils';
import './Attachment.css';
import SummaryList from '../widgets/SummaryList'
import { CircularProgress } from "@material-ui/core";

declare const PCore: any;

export default function Attachment(props) {
  const {value, getPConnect, label} = props;
  /* this is a temporary fix because required is supposed to be passed as a boolean and NOT as a string */
  let { required, disabled } = props;
  [required, disabled] = [required, disabled].map(
    prop => prop === true || (typeof prop === 'string' && prop === 'true')
  );
  let arFileList$: any;
  const pConn = getPConnect();

  let fileTemp: any = {};
  if (value && value.pxResults && +value.pyCount > 0) {
    fileTemp = buildFilePropsFromResponse(value.pxResults[0]);
  }

  let categoryName = '';
  if (value && value.pyCategoryName) {
    categoryName = value.pyCategoryName;
  }

  let valueRef = pConn.getStateProps().value;
  valueRef = valueRef.indexOf('.') === 0 ? valueRef.substring(1) : valueRef;

  const [file, setFile] = useState(fileTemp);

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
        pConn.attachmentsInfo = {
          type: "File",
          attachmentFieldName: valueRef,
          category: categoryName,
          ID: fileRes.ID
        };

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
            attachmentUploaded: true
          };
        });
      })

      .catch(() => {
        // just catching the rethrown error at uploadAttachment
        // to handle Unhandled rejections
      });
  };

  function _removeFileFromList(item: any) {
    const arFileList = file.props.arFileList$;
    if (item !== null) {
      for (const fileIndex in arFileList) {
        if (arFileList[fileIndex].id === item.id) {
          // remove the file from the list and redraw
          arFileList.splice(parseInt(fileIndex, 10), 1);
           // call delete attachment
            if (value && value.pxResults[0]) {
              pConn.attachmentsInfo = {
                type: "File",
                attachmentFieldName: valueRef,
                delete: true
              };
            } else {
              pConn.attachmentsInfo = null;
            }
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
    }
  }

  let content = (
    <div className='file-div'>
        {file.inProgress && (<div className="progress-div"><CircularProgress /></div>)}
        <label htmlFor='upload-photo'>
          <input
            style={{ display: 'none' }}
            id='upload-photo'
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
        <SummaryList menuIconOverride$='trash' arItems$={file.props.arFileList$} menuIconOverrideAction$={_removeFileFromList}></SummaryList>
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
