import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { buildFilePropsFromResponse, getIconFromFileType, validateMaxSize, getIconForAttachment } from './AttachmentUtils';
import './Attachment.css';
import SummaryList from '../widgets/SummaryList'
declare const PCore: any;

export default function Attachment(props) {
  // const {getPConnect} = props;
  const {
    value,
    validatemessage,
    getPConnect,
    label,
    helperText,
    testId,
    displayMode,
    variant,
    hideLabel
  } = props;
  /* this is a temporary fix because required is supposed to be passed as a boolean and NOT as a string */
  let removeFileFromList$: any;
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
 // removeFileFromList$ = { onClick: _removeFileFromList.bind(this) }
  const onFileAdded = (event) => {
   const addedFile = event.target.files[0];
    /* temporarily hardcoded to max 5 MB */
    // const maxAttachmentSize = PCore.getEnvironmentInfo().getMaxAttachmentSize() || 5;

    // if (!validateMaxSize(addedFile, maxAttachmentSize)) {
    //   setFile({
    //     props: {
    //       name: pConn.getLocalizedValue('Unable to upload file'),
    //       meta: pConn.getLocalizedValue(`File is too big. Max allowed size is ${maxAttachmentSize}MB.`),
    //       icon: getIconFromFileType(addedFile.type),
    //       error: true
    //     }
    //   });
    //   return;
    // }

    setFile({
      props: {
        name: addedFile.name,
        icon: getIconFromFileType(addedFile.type),
      },
      inProgress: true
    });
    let arFiles$ = getFiles(event.target.files);
    let myFiles: any = Array.from(arFiles$);
    const onUploadProgress = (ev) => {
      const progress = Math.floor((ev.loaded / ev.total) * 100);
      setFile((current) => {
        return {
          ...current,
          props: {
            ...current.props,
            progress
          },
          inProgress: true
        };
      });
    };

    const errorHandler = (isFetchCanceled) => {

    };

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
          };
        });
      })

      .catch((error) => {
        // just catching the rethrown error at uploadAttachment
        // to handle Unhandled rejections
      });
  };

  function getFiles(arFiles: Array<any>) {

    return setNewFiles(arFiles);
  }

  function setNewFiles(arFiles, current = []) {

    let index = 0;
    for (let file of arFiles) {
      if (!validateMaxSize(file, 5)) {
        file.error = true;
        file.meta = "File is too big. Max allowed size is 5MB.";
      }
      file.mimeType = file.type;
      file.icon = getIconFromFileType(file.type);
      file.ID = `${new Date().getTime()}I${index}`;
      index++;
    }

    return arFiles;
  }

  function _removeFileFromList(item: any) {
    if (item != null) {
      for (let fileIndex in arFileList$) {
        if (arFileList$[fileIndex].id == item.id) {
          // remove the file from the list and redraw
          arFileList$.splice(parseInt(fileIndex), 1);

            // call delete attachment
            // if (this.value$ && this.value$.pxResults[0]) {
            //   this.pConn$.attachmentsInfo = {
            //     type: "File",
            //     attachmentFieldName: this.att_valueRef,
            //     delete: true
            //   };
            // } else {
            //   pConn.attachmentsInfo = null;
            // }

            // this.bShowSelector$ = true;
        }
      }
    }
  }


function getNewListUtilityItemProps({
    att,
    cancelFile,
    downloadFile,
    deleteFile,
    removeFile
  }) {
    let actions;
    let isDownloadable = false;

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
      isDownloadable = att.links.download;
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
        progress: att.progress == 100 ? undefined: att.progress,
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

  let content = (
    <div className='file-div'>
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

  if (file && file.inProgress) {
    // let progressValue = file.props.progress;
    // content = (<div className="file-display">
    //   <SummaryList menuIconOverride$='trash' arItems$={file.props.arFileList$}></SummaryList>
    // </div>)
    content = (
      <div>
        {file.props.arFileList$ && file.props.arFileList$.length > 0 && (
           <SummaryList menuIconOverride$='trash' arItems$={file.props.arFileList$}></SummaryList>
        )}
        {file.props.arFileList$ && file.props.arFileList$.length===0 && (
            <></>
        )}
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
