# GDS Check Answers Page

## User creds

User ID: 586080050177
Password: hfIEX9AHErb2
NINO: PJ059681C
Email Address: gabi.lawrence@example.com

## To Do

1. Populate data

- ~~Data from other classes/contexts~~
- ~~Read only group values~~

2. Clean up Pega branch
3. ~~Discuss AppContext.ts file changes with Peter~~
4. ~~Check errors when creating components~~
5. ~~ Account for when conditions ~~
6. Using <p> tags for comma separated text blocks - ensure margin is removed.
7. ~~Don't display the initial render~~
8. ~~ Is there a better way to ensure the initial render has taken place - currently setting a timeout.
   - switched to a check for child elements, only runs the update if a summary list row is detected - signalling that rendering is complete. ~~
9. ~~Welsh language support~~

## View structure

```
Check Claimant Answers 2
    Change Claimant Answers Wrapper
        CYA NINO
            Summary claimant NINO
        Change Claimant Answers
            CYA Claimant Details 1 Auth
                CYA Claimant Current Address
            CYA Claimant Details 1 UnAuth
                CYA Claimant Current Address
            Claimant Previous Address
            CYA Claimant Previous Address
            Summary Telephone
            Claimant CYA Nationality
            CYA Claimant Residence History
                Claimant Where have you lived?
                Claimant Check UK Residency
        Change Claimant Answers 2
            CYA Claimant Employment Status
            CYA Another Country
            Are you claiming Child Benefit right now?
            Claimant Eldest Child Summary
            What other benefits do you claim?
            CYA Claimant Is HMForcesOrCivilServant

```

## Data fetching

`component = getPConnect().createComponent(arr[0].getRawMetadata())`

```const arr=[];

function getAllChildren(pConnect){
if(pConnect.getComponentName && pConnect.getComponentName()==="reference"){
    var viewPConnect = pConnect.getReferencedViewPConnect().getPConnect();
    getAllChildren(viewPConnect);
}else if(pConnect.getComponentName && pConnect.getComponentName()==="View" || pConnect.getComponentName()==="Region"){
    pConnect.getChildren().forEach(child=>
    	getAllChildren(child.getPConnect()));
}else{
    arr.push(pConnect);
}
};

console.log(arr);
```
