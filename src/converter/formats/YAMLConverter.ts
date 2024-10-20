import { LoggerFactory } from "../../logging/LoggerFactory";
import yaml from "yaml"
import { FormatConverter } from "./FormatConverter";

const log = LoggerFactory.createLogger('YAMLConverter');

export const YAMLConverter: FormatConverter = {
    parse(str: string): object {
        return yaml.parse(str, {})
    },

    stringify(obj: object): string {
        return yaml.stringify(obj, {})
    }
}