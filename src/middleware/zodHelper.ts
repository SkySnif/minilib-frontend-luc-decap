/// TODO: To move in hender core utils
import z from "zod";

export const zBooleanFromQuery = () =>
  z
    .union([z.string(), z.boolean(), z.number()])
    .transform((val) => {
      if (val === true || val === "true" || val === "1" || val === 1) return true;
      if (val === false || val === "false" || val === "0" || val === 0) return false;
      return val;
    });

export const zBooleanFromQueryOptional = () =>
  zBooleanFromQuery().optional();

export const zNumberFromQuery = () =>
  z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (val === "" || val === null) return undefined;
      const num = Number(val);
      return Number.isNaN(num) ? undefined : num;
    });

export const zNumberFromQueryOptional = () =>
  zNumberFromQuery().optional();

export const zNumberStrict = (min?: number, max?: number) => {
  let schema = zNumberFromQuery();

  if (min !== undefined) schema = schema.refine(v => v === undefined || v >= min, `>= ${min}`);
  if (max !== undefined) schema = schema.refine(v => v === undefined || v <= max, `<= ${max}`);

  return schema.optional();
};

export const zDateFromQuery = () =>
  z
    .union([z.string(), z.date()])
    .transform((val) => {
      if (!val) return undefined;
      const d = new Date(val);
      return isNaN(d.getTime()) ? undefined : d;
    });

export const zDateFromQueryOptional = () =>
  zDateFromQuery().optional();

export const zEnumFromQuery = <T extends readonly [string, ...string[]]>(values: T) =>
  z
    .union([z.enum(values), z.string()])
    .transform((val) => {
      return values.includes(val as any) ? val : undefined;
    });

export const zEnumFromQueryOptional = <T extends readonly [string, ...string[]]>(values: T) =>
  zEnumFromQuery(values).optional();

export const zStringClean = () =>
  z
    .union([z.string(), z.undefined()])
    .transform((val) => {
      if (!val) return undefined;
      const trimmed = val.trim();
      return trimmed === "" ? undefined : trimmed;
    });

