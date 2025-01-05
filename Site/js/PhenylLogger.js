// Enables or disables console logging. Set to false to disable logging during production.
const IS_DEBUGGING_MODE = true;

// Different types that can be used to log messages
// ---------------------------------------------------
const LOG_NORMAL  = 0;  // Default log type: console.log
const LOG_INFO    = 1;  // Info log type: console.info
const LOG_WARNING = 2;  // Warning log type: console.warn
const LOG_ERROR   = 3;  // Error log type: console.error
// ---------------------------------------------------

// Function to obtain the current date (e.g, for use in timestamps) in
// in the following format: MM/DD/YYYY
function getCurrentDate() {
  let now = new Date();         // Init new Date instance for timestamp 
  let mm = now.getMonth() + 1;  // Get the Month (Is 0-indexed, so add 1)
  let dd = now.getDate();       // Get the day of the month
  let yyyy = now.getFullYear(); // Get the full 4-digit year
  mm = mm < 10 ? "0" + mm : mm; // Ensure current month is 2-digit
  dd = dd < 10 ? "0" + dd : dd; // Ensure current day is 2-digit
  // Return the formatted date string
  return `${mm}/${dd}/${yyyy}`;
}

// Function to obtain the current time (e.g, for use in timestamps) in
// in the following format: HH:MM:SS
function getCurrentTime() {
  let now = new Date();          // Init new Date instance for timestamp
  let hrs = now.getHours();      // Get Current Hour
  let min = now.getMinutes();    // Get Current Minute
  let sec = now.getSeconds();    // Get Current Second
  if (hrs < 10) hrs = "0" + hrs; // Ensure current hour is 2-digit
  if (min < 10) min = "0" + min; // Ensure current minute is 2-digit
  if (sec < 10) sec = "0" + sec; // Ensure current second is 2-digit
  // Return the formatted time string
  return `${hrs}:${min}:${sec}`;
}


// Utility:
// Function is used to construct a version of the provided message in which all
// placeholders (for example: %s, %d, ...) have been replaced with the actual 
// values (provided as arguments)
function formatString(message, args) {
    return message.replace(/%[sdjfxoc%]/g, (match) => {
        switch (match) {
            case '%s': return String(args.shift()); // Replace (%s) with String value
            case '%d': return Number(args.shift()); // Replace (%d) with Integer/Number value
            case '%f': return parseFloat(args.shift()).toFixed(2); // Replace (%f) with Floating-point value, 2 decimal places
            case '%j': return JSON.stringify(args.shift(), null, 2); // Replace (%j) with JSON stringified value
            case '%x': return parseInt(args.shift()).toString(16); // Replace (%x) with Hexadecimal value
            case '%o': return String(args.shift()); // Replace (%o) with Object or raw value (stringified)
            case '%%': return '%'; // Replace (%%) with single % symbol
            case '%c':
                let style = args.shift(); // Get the CSS style string
                // Return the %c format for the actual message's styled output
                return `%c${args.shift()}`;

            // Return the match as is if not handled
            default: return match;
        }
    });
}

// Function used for when the user wants to log a message that has been
// formatted with arguments to the console
function PhenylPrintf(message, ...args) {
    if (!IS_DEBUGGING_MODE) return false;

    // Default to LOG_NORMAL if no type is provided
    let type = LOG_NORMAL;

    // Check if the first argument is a known log type:
    // LOG_INFO | LOG_WARNING | LOG_ERROR | LOG_NORMAL
    if (typeof message === "number" && message >= 0 && message <= 3) {
        // Remove the log type and set it to 'type'
        type = message;
        message = args.shift();
    }

    // First we can get the name of the calling function using:
    // - "<Current FunctionName>.caller.name"
    let functionName = PhenylPrintf.caller.name;

    // Now we create a string that has been formatted, where all placeholders (such
    // as for ex: %s, %d, ...) have been replaced with the actual values
    let formattedString = formatString(message, args);
    
    // Now we get the current date (mm/dd/yyyy) and time (hh:mm:ss) before we
    // then construct a new formatted string for the timestamp in the format
    // of [mm/dd/yyyy hh:mm:ss]. This is later used in the message to log
    let logTimestamp = `[${getCurrentDate()} ${getCurrentTime()}]`;
    
    // Finally, we combine all of the strings, timestamp, caller function name,
    // the string after being formatted with arguments
    let logFunctionNameStr = `${logTimestamp} From ${functionName}(): ${formattedString}`;

    // Perform a lookup for what type of logging is to be used
    switch (type) {
        case LOG_INFO:    console.info(logFunctionNameStr, ...args);  break;
        case LOG_WARNING: console.warn(logFunctionNameStr, ...args);  break;
        case LOG_ERROR:   console.error(logFunctionNameStr, ...args); break;
        case LOG_NORMAL:  console.log(logFunctionNameStr, ...args);   break;
        default:
            console.log(logFunctionNameStr, ...args);
            break;
    };

    return true;
}

// Function Used when the user only wants to log a non-formatted message 
// without any arguments to the console
function PhenylPrint(message) {
    if (!IS_DEBUGGING_MODE) return false;

    // Default to LOG_NORMAL if no type is provided
    let type = LOG_NORMAL;

    // Check if the first argument is a known log type:
    // LOG_INFO | LOG_WARNING | LOG_ERROR | LOG_NORMAL
    if (typeof message === "number" && message >= 0 && message <= 3) {
        // Remove the log type and set it to 'type'
        type = message;
        message = args.shift();
    }
    
    // First we can get the name of the calling function using:
    // - "<Current FunctionName>.caller.name"
    let functionName = PhenylPrint.caller.name;

    
    // Now we get the current date (mm/dd/yyyy) and time (hh:mm:ss) before we
    // then construct a new formatted string for the timestamp in the format
    // of [mm/dd/yyyy hh:mm:ss]. This is later used in the message to log
    let logTimestamp = `[${getCurrentDate()} ${getCurrentTime()}]`;
    
    // Finally, we combine all of the strings, timestamp, caller function name,
    // the string after being formatted with arguments
    let logFunctionNameStr = `${logTimestamp} From ${functionName}(): ${message}`;
    

    // Perform a lookup for what type of logging is to be used
    switch (type) {
        case LOG_INFO:    console.info(logFunctionNameStr);  break;
        case LOG_WARNING: console.warn(logFunctionNameStr);  break;
        case LOG_ERROR:   console.error(logFunctionNameStr); break;
        case LOG_NORMAL:  console.log(logFunctionNameStr);   break;
        default:
            console.log(logFunctionNameStr);
            break;
    };

    return true;
}

