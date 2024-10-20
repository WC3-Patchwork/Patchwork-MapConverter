import { LoggerFactory } from "../../logging/LoggerFactory";
import { XMLBuilder, XMLParser } from "fast-xml-parser"
import { FormatConverter } from "./FormatConverter";
import EnhancementManager from "../../enhancements/EnhancementManager";

const log = LoggerFactory.createLogger('XMLConverter');

export const XMLConverter: FormatConverter = {
    parse(str): object {
        const result = new XMLParser({

        }).parse(str);
        if (result.data) {
            return result.data;
        } else {
            return result;
        }
    },

    stringify(obj): string {
        return new XMLBuilder({
            format: EnhancementManager.prettify,
            arrayNodeName: 'data',
        }).build(obj);
    }
}