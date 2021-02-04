/**
 * @module emailProvider.schema
 */
import * as Yup from 'yup'


export const GMAIL = Yup.string().matches(new RegExp("([G|g]mail|GMAIL)"))
export const OFFICE = Yup.string().matches(new RegExp(/([O|o]ffice\s*365|OFFICE\s*365)/))