import React, { Component } from 'react';
const initialvalues = {
    firno: '',
    secno: '',
    operator: '+',
    firnoError: '',
    secnoError: '',
    resultmessage: '',
    resultclass: '',
    reminderInt: '',
    reminderRoman: '',
    finalAnswer: '',
    reminderanswer: '',
    firelementclass: 'inputblock',
    secelementclass: 'inputblock'
}
const genvalues = {
    isFormValid: false,
    firnovalid: false,
    secnovalid: false,
    numArray: [],
    numArrayConvt: []
}
class Form extends Component {
    constructor(props) {
        super(props)
        this.state = initialvalues;
        this.formgenvalues = genvalues;
    }
    handlefirnochange = (event) => {
        this.formgenvalues.firnovalid = this.checkValue(event)
        this.setState({
            firno: event.target.value
        })
    }
    handlesecnochange = (event) => {
        this.formgenvalues.secnovalid = this.checkValue(event)
        this.setState({
            secno: event.target.value
        })
    }
    handleoperatorchange = (event) => {
        this.setState({
            operator: event.target.value
        })
    }
    handleformsubmit = event => {
        this.formgenvalues.numArray = [];
        this.formgenvalues.numArrayConvt = [];
        let firnoError, secnoError, numconverted, resultmessage, resultclass, reminderanswer;
        let reminderInt = 0;
        if (this.formgenvalues.firnovalid && this.formgenvalues.secnovalid) {
            this.formgenvalues.numArray.push(this.state.firno, this.state.secno);
            for (let element of this.formgenvalues.numArray) {
                numconverted = this.convertToInt(element)
                if (numconverted < 0) { return }
                this.formgenvalues.numArrayConvt.push(numconverted);
            }
            if (this.state.operator === '-' && this.formgenvalues.numArrayConvt[0] < this.formgenvalues.numArrayConvt[1]) {
                resultmessage = 'Cannoct subtract Higher number from a Lower Number';
                resultclass = 'result error';
                this.setState({ resultmessage })
                this.setState({ resultclass })
                reminderanswer = '';
                this.setState({ reminderanswer })
                event.preventDefault();
                return false;
            }
            if (this.state.operator === '/' && this.formgenvalues.numArrayConvt[0] < this.formgenvalues.numArrayConvt[1]) {
                resultmessage = 'Cannoct divide Higher number into Lower Number';
                resultclass = 'result error';
                this.setState({ resultmessage })
                this.setState({ resultclass })
                reminderanswer = '';
                this.setState({ reminderanswer })
                event.preventDefault();
                return false;
            }
            else {
                resultclass = 'result success';
                this.setState({ resultclass })
                let logicAnswer = eval([this.formgenvalues.numArrayConvt[0], this.state.operator, this.formgenvalues.numArrayConvt[1]].join(""));
                reminderInt = (this.state.operator === '/') ? this.formgenvalues.numArrayConvt[0] % this.formgenvalues.numArrayConvt[1] : 0;
                this.setState({ reminderInt })
                const reminderRoman = this.convertToroman(reminderInt);
                this.setState({ reminderRoman })
                const finalAnswer = (logicAnswer === 0) ? 'ZERO' : this.convertToroman(logicAnswer);
                resultmessage = 'The Answer is : ' + finalAnswer
                this.setState({ resultmessage })
                reminderanswer = (reminderInt !== '0' && this.state.operator === '/') ? 'The Reminder is : ' + reminderRoman : '';
                this.setState({ reminderanswer })
            }
        }
        else {
            (this.formgenvalues.firnovalid) ? firnoError = '' : firnoError = 'Please Enter A Value';
            (this.formgenvalues.secnovalid) ? secnoError = '' : secnoError = 'Please Enter A Value';
            this.setState({ firnoError })
            this.setState({ secnoError })
        }
        event.preventDefault();
    }
    checkValue = (ctrl) => {
        let valuetocheck = ctrl.target.value;
        let ctrlinput = ctrl.target.id
        let firnoError, secnoError, firelementclass, secelementclass;
        if (valuetocheck !== '') {
            let inputnum = this.validRoman(valuetocheck);
            if (inputnum) {
                (ctrlinput === 'firnum') ? firnoError = '' : secnoError = '';
                (ctrlinput === 'firnum') ? this.setState({ firnoError }) : this.setState({ secnoError });
                (ctrlinput === 'firnum') ? firelementclass = 'inputblock' : secelementclass = 'inputblock';
                (ctrlinput === 'firnum') ? this.setState({ firelementclass }) : this.setState({ secelementclass })
                return inputnum;
            }
            else {
                (ctrlinput === 'firnum') ? firnoError = 'Not a Valid Roman Number' : secnoError = 'Not a Valid Roman Number';
                (ctrlinput === 'firnum') ? this.setState({ firnoError }) : this.setState({ secnoError });
                (ctrlinput === 'firnum') ? firelementclass = 'inputblock haserror' : secelementclass = 'inputblock haserror';
                (ctrlinput === 'firnum') ? this.setState({ firelementclass }) : this.setState({ secelementclass })
                return inputnum;
            }
        }
        else {
            (ctrlinput === 'firnum') ? firnoError = 'Please Enter A Value' : secnoError = 'Please Enter A Value';
            (ctrlinput === 'firnum') ? this.setState({ firnoError }) : this.setState({ secnoError });
            (ctrlinput === 'firnum') ? firelementclass = 'inputblock haserror' : secelementclass = 'inputblock haserror';
            (ctrlinput === 'firnum') ? this.setState({ firelementclass }) : this.setState({ secelementclass })
        }
    }
    convertToInt = (str1) => {
        if (str1 !== null && this.validRoman(str1)) {
            let num = this.chartoint(str1.charAt(0));
            let pre, curr;
            for (let i = 1; i < str1.length; i++) {
                curr = this.chartoint(str1.charAt(i));
                pre = this.chartoint(str1.charAt(i - 1));
                if (curr <= pre) {
                    num += curr;
                } else {
                    num = num - pre * 2 + curr;
                }
            }
            return num;
        }
        else {
            return -1;
        }
    }
    chartoint = (c) => {
        switch (c) {
            case 'I': return 1;
            case 'V': return 5;
            case 'X': return 10;
            case 'L': return 50;
            case 'C': return 100;
            case 'D': return 500;
            case 'M': return 1000;
            default: return -1;
        }
    }
    validRoman = (romanNum) => {
        let isvalidRoman;
        let num = romanNum.toUpperCase();
        let validRomanNums = ["M", "D", "C", "L", "X", "V", "I", "(", ")"]
        for (let i = 0; i < num.length; i++) {
            isvalidRoman = validRomanNums.includes(num.charAt(i));
            if (!isvalidRoman) { return false }
        }
        return isvalidRoman;
    }
    convertToroman = (num) => {
        const lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
        let roman = '';
        for (let i in lookup) {
            while (num >= lookup[i]) {
                roman += i;
                num -= lookup[i];
            }
        }
        return roman;
    }
    render() {
        const { firno, operator, secno, firnoError, secnoError, resultmessage, resultclass, reminderanswer, firelementclass, secelementclass } = this.state
        return (
            <div className='main'>
                <h2 className="heading">Roman Number Caculator</h2>
                <form onSubmit={this.handleformsubmit}>
                    <div className={firelementclass}>
                        <input autoComplete='off' type='text' id="firnum" placeholder='First Number' value={firno}
                            onChange={this.handlefirnochange} />
                        <span>{firnoError}</span>
                    </div>
                    <div className="inputblock">
                        <select value={operator} onChange={this.handleoperatorchange}>
                            <option value='+'>+</option>
                            <option value='-'>-</option>
                            <option value='*'>x</option>
                            <option value='/'>÷</option>
                        </select>
                    </div>
                    <div className={secelementclass}>
                        <input autoComplete='off' type='text' placeholder='Second Number' value={secno}
                            onChange={this.handlesecnochange} />
                        <span>{secnoError}</span>
                    </div>
                    <div className="btnsection">
                        <span className={resultclass}>
                            {resultmessage} <br />{reminderanswer}
                        </span>
                        <button type='submit'>Submit</button>
                        <div className="clearfix"></div>
                    </div>
                </form>
            </div>
        )
    }
}
export default Form