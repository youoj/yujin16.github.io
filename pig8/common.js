const bTestMode = true;
const startDate   = new Date( 2020, 6 - 1 );
const currentDate = new Date( );
const Name = Object.freeze({ 0:"daseul", 1:"dowon", 2:"sujee", 3:"sujin", 4:"sion", 5:"yujin", 6:"jueun", 7:"haeun" });

var strPassword = '';

function MoneyData( data ) 
{
    console.assert( data.interest );
    console.assert( data.income );
    console.assert( data.expense );

    var nIncome = 0;
    var aryIncome = new Array();
    $.each( data.income, function( person, income ) 
    {
        var index = 0;

        var aryKey = Object.keys( income )
        for( var k in aryKey )
        {
            var sKey = aryKey[k];
            if( 'name' == sKey )
            {
                continue;
            }

            console.assert( -1 != sKey.indexOf('year', 0) );

            var nYear = parseInt('20' + sKey.split('year')[1]);
            for( var i = 0; i < 12; i++ )
            {
                var date = new Date( nYear, i );
                if( startDate > date || currentDate < date  )
                {
                    continue;
                }
                
                if( null == aryIncome[index] )
                {
                    aryIncome.push( [0, 0, 0, 0, 0, 0, 0, 0] );
                }

                aryIncome[index][person] = income[sKey][i];
                nIncome += income[sKey][i];
                index++;
            }
        }
    });
    console.assert( aryIncome );
    
    var nInterest = 0;
    for( var i in data.interest )
    {
        nInterest += data.interest[i];
    }

    var nExpense = 0;
    var aryExpense = new Array();
    $.each( data.expense, function( index, expense ) 
    {
        aryExpense.push( expense );

        for( var idx in expense.payment )
        {
            nExpense += expense.payment[idx].pay;
        }
    });
    console.assert( aryExpense );

    this.m_aryIncome = aryIncome;
    this.m_aryExpense = aryExpense;

    this.m_nIncome = nIncome;
    this.m_nInterest = nInterest;
    this.m_nExpense = nExpense;
}


/* click event */
window.onclick = function(e) {
    if( e.target == document.getElementById('account') )
    {
        showPasswordModal();
    }

    if( e.target == document.getElementById('modalPassword') || e.target == document.getElementById('btnModalClose') )
    {
        closePasswordModal();
    }
}

function showPasswordModal() 
{
    $( '#modalPassword' ).show();
    $( '#copyright' ).hide();

    strPassword = '';
    fillPasswordCircle( 0 );

    $( '.js-number' ).off( 'click' ).on( 'click', function() {
        strPassword += $.trim( $(this).text() );
        fillPasswordCircle( strPassword.length );

        if( 4 <= strPassword.length )
        {
            if( true == checkPassword(strPassword) )
            {
                sleep(300).then(() => {
                    closePasswordModal();
                    copyAccountToClipboard();
                    
                    strPassword = '';
                    fillPasswordCircle( 0 );
                });
            }
            else
            {
                strPassword = '';
                fillPasswordCircle( 0 );
            }
        }
    });

    $( '#btnRemoveNumber' ).off( 'click' ).on( 'click', function() {
        strPassword = strPassword.slice(0, -1);
        fillPasswordCircle( strPassword.length );
    });
}

function closePasswordModal() 
{
    $( '#modalPassword' ).hide();
    $( '#copyright' ).show();

    strPassword = '';
    fillPasswordCircle( 0 );
}

function fillPasswordCircle( nCount )
{
    console.assert( nCount <= 4 );

    ( 1 <= nCount )? $( '#password1' ).css( 'backgroundColor', '#FF9376' ) : $( '#password1' ).css( 'backgroundColor', '#D9D9D9' );
    ( 2 <= nCount )? $( '#password2' ).css( 'backgroundColor', '#FF9376' ) : $( '#password2' ).css( 'backgroundColor', '#D9D9D9' );
    ( 3 <= nCount )? $( '#password3' ).css( 'backgroundColor', '#FF9376' ) : $( '#password3' ).css( 'backgroundColor', '#D9D9D9' );
    ( 4 <= nCount )? $( '#password4' ).css( 'backgroundColor', '#FF9376' ) : $( '#password4' ).css( 'backgroundColor', '#D9D9D9' );
}

function checkPassword( sData ) {
    var sDecData = Encrypt.decrypt( Encrypt.password );

    console.assert( sData.length );
    console.assert( sDecData.length );

    if( sData == sDecData )
    {
        return true;
    }

    return false;
}

function copyAccountToClipboard() {
    var textArea = document.createElement( 'textarea' );
    textArea.value = Encrypt.decrypt( Encrypt.account );

    document.body.appendChild( textArea );
    textArea.select();

    document.execCommand( 'copy' );
    document.body.removeChild( textArea );

    $( '#alertCopyAccout' ).show();
    sleep(1000).then(() => {
        $( '#alertCopyAccout' ).fadeOut();
    });
}


/*
 * 계좌번호와 비밀번호를 암호화 한 데이터
 */
var Encrypt = {
    account  : 'cP+RvL+x406nC6mbsCxykFCuS210GHqJri+wAhMeT4KbcZqhwmyBEVRURIsXfwbAYAK9NUWwqiM/6I3+L5VFSL'
             + '6i4Dck5X88+YKv4u6/kD0ALGNteJ/glElT/AzYWCBpceyLimYv4qDFJ3wd2VLei0o8bYLTKM4hhr0Aj2gLp2s=',
    password : 'lgZsWoPvwCJilHB4uKqkP9XYzkHeb4Lb4WRBLxZuVj0nmrilxkHeOSDioJxepNxvJ5e3h0garHeusDZYwezSSu'
             + 'PO9zvBh6oCBUcIsoY4tsahdOQT/XlgR/VvK053PJaIUHSCbRmvj8JHu+U7tgrPM4ypnIUBomE83blvQjZOhTE=',
    privateKey : '-----BEGIN RSA PRIVATE KEY-----'
               + 'MIICXgIBAAKBgQDWx3dB6wYmB81h8mcW3qPHAlBezlEGClnUeUmQhKJJmR60culc'
               + '841AoPsFvnP7qJqdibv8lDckV5JErbdeEF9k26GW8/8WHS5i5UI2smkerw8ak0WT'
               + 'EaJ35JW0cRsSCoPttrIuL0GaD19CYdNxAHB54hT17HTz8mEDnBdnRAEQIwIDAQAB'
               + 'AoGBAM3QDG7FWXn+Bgiy8aiPpp+gjwWabTf9mUErDJyJDL68FRlT+F3TIWtqF8HU'
               + 'VG42jhsijlqmaQTRSd+4G7vusolA2gXuYICK3JzUUWExeE19TjN5GirSIBXZT445'
               + 'i80ODh4EVQRoZttDy3yzTkn2AtXQGYCDRDntQpaTbi8bfhtRAkEA83uq0q9hJxe8'
               + 'SQtXvP+kbw8RmWHyBXDF/uUIWrf4sj/9X9gvv5K/QS187bZwdj7Wix/iHLzRedtp'
               + 'jFI7LjSyCQJBAOHSCzkYXtnAxWplbNATFUnBkuL3E+gBJ1Pfaetfh5xzOXJ04XGE'
               + 'LS6fNiyUyxKs9QGC5Ek1Vd8u4LNu7BZli8sCQEeP628s+MMCqOZXHRyBjpTNuwB3'
               + '1yheMvNt4Xy4YbISOKg45  B/MQ8YmVnePjZJTeb8+SbjkjjTgli8V5Cr6dfECQQDS'
               + 'doivNd9w4xEbEFxRsPduPlM/5TdQS4Lz0I1PKUGitmEcI4LZ4W6avRgohKSfS0Mt'
               + 'nWhWMrdNwsr5cK/oT8vxAkEAj47mUFHbveeWVIWalqMNTrwWpp/1ywbk8ar06nQv'
               + 'Qz3UisO4SjD7isnmNMr87ZzrB+9EmUUg8rhmul1Hpv8A0A=='
               + '-----END RSA PRIVATE KEY-----',
    decrypt : function( sData ) {
        var objDecrypt = new JSEncrypt();
        objDecrypt.setKey( this.privateKey );

        var sDecData = objDecrypt.decrypt( sData );

        console.assert( sDecData );
        console.assert( sDecData.length );

        return sDecData;    
    }
};


function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}


{   // Formatting
    
    /*
     * 숫자 100000 > 100,000 으로 표기
     * usage : number.format()
     */
    Number.prototype.format = function()
    {
        if( this == 0 )
        {
            return 0;
        }
        
        var reg = /(^[+-]?\d+)(\d{3})/;
        var n = ( this + '' );
        
        while (reg.test(n))
        {
            n = n.replace( reg, '$1' + ',' + '$2' );
        }
        
        return n;
    }
    
    /*
     * 문자 100000 > 100,000 으로 표기
     * usage : string.format()
     */
    String.prototype.format = function() {
        var num = parseFloat(this);
        
        if( isNaN(num) )
        {
            return "0";
        }
        
        return num.format();
    };
    
    /* 
     * 시간을 yyyy.MM 포맷으로 변경한다.
     * usage : date.format("yyyy.MM")
     */
    Date.prototype.format = function(f) {
        if (!this.valueOf()) return " ";
        
        var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
        var d = this;
        
        return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1)
        {
            switch ($1)
            {
                case "yyyy": return d.getFullYear();
                case "MM": return (d.getMonth() + 1).zf(2);
                case "dd": return d.getDate().zf(2);
                case "E": return weekName[d.getDay()];
                case "HH": return d.getHours().zf(2);
                case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
                case "mm": return d.getMinutes().zf(2);
                case "ss": return d.getSeconds().zf(2);
                case "a/p": return d.getHours() < 12 ? "오전" : "오후";
                default: return $1;
            }
        });
    };
    
    /*
     * 1월 > 01월로 변경해준다.
     */
    String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
    String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
    Number.prototype.zf = function(len){return this.toString().zf(len);};
}
