


// 1) adding global functions - WARGNING: THIS IS WORKING, BUT SHOULD NOT BE USED
window.testFunctionGlobal = () => {console.log("it's working as well");}


// 2) adding global classes
class testPersonalCodeClass {

    constructor() {
        this.test = "defaultTest";
    }

    testFunction() {
    console.log("IT'S WORKING:!!!");
    }

}

export default testPersonalCodeClass;
