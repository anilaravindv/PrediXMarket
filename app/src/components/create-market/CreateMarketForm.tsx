import {Field, Form, Formik} from "formik";
import {DateTime} from "luxon";
import * as yup from "yup";
import InputErrorMessage from "components/common/InputErrorMessage";
import DatePickerInput from "../common/DatePickerInput";

const CreateMarketForm = ({initialValues, onSubmit}) => {
    const minExpDate = DateTime.now().toJSDate();

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={yup.object({
                name: yup.string()
                    .max(200, 'Must be 200 characters or less')
                    .required('Required'),
                about: yup.string()
                    .max(2000, 'Must be 2000 characters or less')
                    .required('Required'),
                expiresAt: yup.date()
                    .min(minExpDate, 'Must be future date')
                    .required('Required'),
                category: yup.string()
                    .required('Required'),
                imageUrl: yup.string()
                    .max(200, 'Must be 200 characters or less')
                    .url()
                    .required('Required'),
                resolver: yup.string()
                    .max(50, 'Must be 50 characters or less')
                    .required('Required'),
                resolutionSource: yup.string()
                    .max(250, 'Must be 250 characters or less')
                    .required("Required"),
                resolutionOperator: yup.string()
                    .max(5, 'Must be 5 characters or less')
                    .when("resolver", {
                        is: 'pyth',
                        then: yup.string().required("Required"),
                    }),
                expectedValue: yup.string()
                    .max(50, 'Must be 50 characters or less')
                    .when("resolver", {
                        is: 'pyth',
                        then: yup.string().required("Required"),
                    }),
                initialLiquidity: yup.number()
                    .moreThan(0, 'Must be greater than zero')
                    .required("Required"),
                bias: yup.number()
                    .min(-1, 'Must be greater than -1')
                    .max(1, 'Must be less than 1')
                    .required("Required"),
                feePercentage: yup.number()
                    .min(0, 'Must be greater than 0')
                    .max(100, 'Must be less than 100')
                    .required("Required"),

            })}
            onSubmit={onSubmit}
        >
            {formik => (
                <Form>
                    <label htmlFor="name" className="mt-8 block">
                        <span className='text-base font-medium'>Market name</span>
                    </label>
                    <Field name="name" type="text"
                           className="mt-1 block w-full rounded-lg bg-neutral-900 px-2 py-1"/>
                    <InputErrorMessage name="name"/>

                    <label htmlFor="about" className="mt-8 block">
                        <span className='text-base font-medium'>About</span>
                    </label>
                    <Field name="about" as="textarea" rows={3}
                           className="mt-1 block w-full rounded-lg bg-neutral-900 px-2 py-1"/>
                    <InputErrorMessage name="about"/>

                    <label htmlFor="expiresAt" className="mt-8 block">
                        <span className='text-base font-medium'>Expires at</span>
                    </label>
                    <DatePickerInput name="expiresAt"
                                     minDate={minExpDate}
                                     dateFormat="yyyy-MM-dd HH:mm"
                                     showTimeSelect
                                     className="mt-1 block w-full rounded-lg bg-neutral-900 px-2 py-1"/>
                    <InputErrorMessage name="expiresAt"/>

                    <label htmlFor="category" className="mt-8 block">
                        <span className='text-base font-medium'>Category</span>
                    </label>
                    <Field name="category" as="select"
                           className="mt-1 block w-full rounded-lg bg-neutral-900 px-2 py-1">
                        <option value="" disabled className="hidden"></option>
                        <option value="sports">Sports</option>
                        <option value="politics">Politics</option>
                        <option value="economics">Economics</option>
                        <option value="crypto">Crypto</option>
                        <option value="science & tech">Science & Technology</option>
                    </Field>
                    <InputErrorMessage name="category"/>

                    <label htmlFor="imageUrl" className="mt-8 block">
                        <span className='text-base font-medium'>Image URL</span>
                    </label>
                    <Field name="imageUrl" type="text"
                           className="mt-1 block w-full rounded-lg bg-neutral-900 px-2 py-1"/>
                    <InputErrorMessage name="imageUrl"/>

                    <label htmlFor="resolver" className="mt-8 block">
                        <span className='text-base font-medium'>Resolver</span>
                    </label>
                    <div>
                        <label>
                            <Field type="radio" name="resolver" value="admin"
                                   className="ml-8 mr-1"/>
                            Admin
                        </label>
                        <label>
                            <Field type="radio" name="resolver" value="pyth"
                                   className="ml-8 mr-1"/>
                            Pyth
                        </label>
                    </div>
                    <InputErrorMessage name="resolver"/>

                    <label htmlFor="resolutionSource" className="mt-8 block">
                        <span className='text-base font-medium'>Resolution Source</span>
                    </label>
                    <Field name="resolutionSource" type="text"
                           placeholder={formik.values.resolver === 'pyth' ? 'Pyth Price Feed ID e.g. J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix' : ''}
                           className="mt-1 block w-full rounded-lg bg-neutral-900 px-2 py-1"/>
                    <InputErrorMessage name="resolutionSource"/>

                    <label htmlFor="resolutionOperator" className="mt-8 block">
                        <span className='text-base font-medium'>Resolver</span>
                    </label>
                    <div>
                        <label>
                            <Field type="radio" name="resolutionOperator" value="eq"
                                   className="ml-8 mr-1"/>
                            Eq (=)
                        </label>
                        <label>
                            <Field type="radio" name="resolutionOperator" value="gt"
                                   className="ml-8 mr-1"/>
                            Gt (&gt;)
                        </label>
                        <label>
                            <Field type="radio" name="resolutionOperator" value="lt"
                                   className="ml-8 mr-1"/>
                            Lt (&lt;)
                        </label>
                    </div>
                    <InputErrorMessage name="resolutionOperator"/>

                    <label htmlFor="expectedValue" className="mt-8 block">
                        <span className='text-base font-medium'>Expected Value</span>
                    </label>
                    <Field name="expectedValue" type="text"
                           className="mt-1 block w-full rounded-lg bg-neutral-900 px-2 py-1"/>
                    <InputErrorMessage name="expectedValue"/>

                    <label htmlFor="initialLiquidity" className="mt-8 block">
                        <span className='text-base font-medium'>Initial Liquidity</span>
                    </label>
                    <Field name="initialLiquidity" type="number" min={0} step={0.01}
                           className="mt-1 block w-full rounded-lg bg-neutral-900 px-2 py-1"/>
                    <InputErrorMessage name="initialLiquidity"/>

                    <label htmlFor="bias" className="mt-8 block">
                        <span className='text-base font-medium'>Bias</span>
                    </label>
                    <Field name="bias" type="number" min={-1} max={1} step={0.01}
                           className="mt-1 block w-full rounded-lg bg-neutral-900 px-2 py-1"/>
                    <InputErrorMessage name="bias"/>

                    <label htmlFor="feePercentage" className="mt-8 block">
                        <span className='text-base font-medium'>Fee Percentage</span>
                    </label>
                    <Field name="feePercentage" type="number" min={0} max={100} step={0.01}
                           className="mt-1 block w-full rounded-lg bg-neutral-900 px-2 py-1"/>
                    <InputErrorMessage name="feePercentage"/>

                    <button type="submit"
                            className="inline-block mt-16 px-8 py-3 bg-amber-200 text-black font-semibold text-xl leading-tight rounded-lg w-full">
                        Create Market
                    </button>
                </Form>
            )}
        </Formik>
    );
}

export default CreateMarketForm;