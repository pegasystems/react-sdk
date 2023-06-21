import React from 'react';
import DateFormatter from '../../../helpers/formatters/Date';
import Button from '../../../components/BaseComponents/Button/Button';
import PropTypes from "prop-types";

declare const PCore: any;

export default function ClaimsList(props){
  const { thePConn, data, options, title, loading, rowClickAction, buttonContent} = props;

  /* Property Resolver */
  const resolveProperty = (source, propertyName) => {
    if (!propertyName) { return '' };

    if(source[propertyName]){ return source[propertyName]};

    let resolvedProperty = source;
    const propertyNameSplit = propertyName.split('.');
    propertyNameSplit.forEach(property => {
      if(resolvedProperty){
        resolvedProperty = resolvedProperty[property];
      }
    });

    if(resolvedProperty){
      return resolvedProperty;
    }
    return '';

  }

  const statusMapping = (status) => {
    switch(status){
      case 'Open-InProgress':
        return {text:'In Progress', tagColour:'grey'};
      case 'Pending-CBS':
        return {text:'Claim Received', tagColour:'blue'};
      case 'Resolved-Completed':
        return {text:'Completed', tagColour:''};
      default:
        return {text:status, tagColour:'grey'};
    }
  }


  function _rowClick(row: any) {
    const {pzInsKey} = row;

    const container = thePConn.getContainerName();
    const target = `root/${container}`;

    if( rowClickAction === 'OpenAssignment'){
      const openAssignmentOptions = { containerName: container};
      PCore.getMashupApi().openAssignment(pzInsKey, target, openAssignmentOptions);
    } else if ( rowClickAction === 'OpenCase'){
      PCore.getMashupApi().openCase(pzInsKey, target, {pageName:'SummaryClaim'});
    }
  }



  let tableContent = <></>;

  if(loading){
    tableContent = <tr><td><h2 className='govuk-heading-m'>Checking for claims...</h2></td></tr>
  }
  else if( data.length > 0 ) {
    tableContent = data.map(row => {
      return (
        <tr className='govuk-summary-list__row' key={row.pyID}>
          <td className='govuk-card '>
            <div className='govuk-summary-card__content govuk-grid-row'>
              <div className='govuk-grid-column-two-thirds govuk-!-padding-0'>
                {options.map(field => {
                  const value = resolveProperty(row, field.name);
                  // Handle Name concatenation
                  if (field.name.includes('FirstName')) {
                    let response = value;

                    const lastNameResults = options.filter(_field =>
                      _field.name.includes('LastName')
                    );
                    if (lastNameResults.length > 0) {
                      const lastName = resolveProperty(row, lastNameResults[0].name);
                      response = response.concat(` ${lastName}`);
                    }
                    return (
                        <div className='govuk-heading-m' key={field.name} aria-label={field.label}>
                          <a>{response}</a>
                        </div>
                    );

                  }
                  // All other fields except for case status
                  if (
                    field.name !== 'pyStatusWork' &&
                    !field.name.includes('FirstName') &&
                    !field.name.includes('LastName')
                  ) {
                    if (field.type === 'Date') {
                      return <div key={field.name} aria-label={field.label}>{DateFormatter.Date(value, { format: 'DD MMMM YYYY' })}</div>;
                    } else {
                      return <div key={field.name} aria-label={field.label}>{value}</div>;
                    }
                  }
                  return null;
                })}
              </div>
              <div className='govuk-grid-column-one-third govuk-!-padding-0'>
                {/* Displays Case status */}
                <strong
                  className={`govuk-tag govuk-tag--${statusMapping(row.pyStatusWork).tagColour} app-claimslist-tag`}
                >
                  {statusMapping(row.pyStatusWork).text}
                </strong>
              </div>
              <div className='govuk-grid-column-two-thirds  govuk-!-padding-0'>
              <Button
                  attributes={{className:'govuk-!-margin-top-4 govuk-!-margin-bottom-4'}}
                  variant='secondary'
                  onClick={() => {
                    _rowClick(row);
                  }}
                >
                {typeof(buttonContent) === 'function' ? buttonContent(row) : buttonContent}
                </Button>
              </div>
            </div>
          </td>
        </tr>
      )})
  }
  else {
    tableContent = <tr className="govuk-table__row">
      <td>
      <div  role="alert">No {title.toLowerCase()}</div>
      </td>
    </tr>
  }


  return (
    <>
    <table className='govuk-summary-list app-claimslist' aria-live="polite" aria-busy={loading}>
      <caption className="govuk-table__caption govuk-table__caption--m">{title}</caption>
      <tbody>
        {tableContent}
      </tbody>
    </table>
    </>
  )
}

ClaimsList.propTypes = {
  thePConn: PropTypes.object,
  data: PropTypes.array,
  options: PropTypes.array,
  title: PropTypes.string,
  loading: PropTypes.bool,
  rowClickAction: PropTypes.oneOf(["OpenCase","OpenAssignment"]),
  buttonContent: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
}
