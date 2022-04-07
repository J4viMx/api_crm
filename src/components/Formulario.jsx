import React from 'react'
import { Formik, Form, Field, ErrorMessage} from 'formik'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import Alerta from './Alerta'
import Spinner from './Spinner'

const Formulario = ({cliente, cargando}) => {

    const navigate = useNavigate()

    const nuevoClienteSchema = Yup.object().shape({
        nombre: Yup.string()
                .min(3, 'El nombre es muy corto')
                .max(40, 'El nombre es muy largo')
                .required('El nombre del Cliente es Obligatorio'),
        empresa: Yup.string()
                .required('El nombre de la empresa es obligatorio'),
        email: Yup.string()
                .required('El email es obligatorio')
                .email('Email no valido'),
        telefono: Yup.number()
                .integer('El número no es valido')
                .positive('El número no es valido')
                .typeError('El número no es valido')
    })

  const handleSubmit = async (valores) => { 
      try{

        let respuesta 

        if (cliente.id){
            //Editando registro

            const url = `${import.meta.env.VITE_API_URL}/${cliente.id}`;

            respuesta = await fetch(url, {
                method: 'PUT',
                body: JSON.stringify(valores),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

        }else{

            //Nuevo Registro
            const url = import.meta.env.VITE_API_URL;

            respuesta = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(valores),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
    

        }

        await respuesta.json()
        navigate('/clientes')

      } catch (error) {
        console.log(error)
      }
  }

  return (
    cargando ? <Spinner /> : (
        <div className='bg-white mt-10 px-5 py-10 rounded-md shadow-md md:w-3/4 mx-auto'>
            <h1 className='text-gray-600 font-bold text-xl uppercase text-center'>{cliente?.nombre ? 'Editar Cliente' : 'Agregar Cliente'}</h1>

            <Formik
                initialValues={{
                    nombre: cliente?.nombre ?? "",
                    empresa: cliente?.empresa ?? "",
                    email: cliente?.email ?? "",
                    telefono: cliente?.telefono ?? "",
                    notas: cliente?.notas ?? ""
                }}
                enableReinitialize={true}
                onSubmit={ async (values, {resetForm}) => {
                    handleSubmit(values)

                    resetForm()
                }}
                validationSchema={nuevoClienteSchema}
            >


                {({errors, touched}) => {
                    
                    return (
                <Form
                    className='mt-10'
                >
                    <div className='mb-4'>
                        <label 
                            htmlFor="nombre"
                            className='text-gray-800'
                        >Nombre:</label>
                        <Field
                            id="nombre"
                            type="text"
                            className="mt-2 block w-full p-3 bg-gray-50"
                            placeholder="Nombre del cliente"
                            name="nombre"
                        />
                        <ErrorMessage name='nombre' className='text-center my-4 bg-red-600 text-white font-bold p-3 uppercase' component="div" />
                    </div>


                    <div className='mb-4'>
                        <label 
                            htmlFor="empresa"
                            className='text-gray-800'
                        >Empresa:</label>
                        <Field
                            id="empresa"
                            type="text"
                            className="mt-2 block w-full p-3 bg-gray-50"
                            placeholder="Nombre del Cliente"
                            name="empresa"
                        />

                        {errors.empresa && touched.empresa ? (
                            <Alerta>{errors.empresa}</Alerta>
                        ): null}

                    </div>

                    <div className='mb-4'>
                        <label 
                            htmlFor="email"
                            className='text-gray-800'
                        >E-mail:</label>
                        <Field
                            id="email"
                            type="email"
                            className="mt-2 block w-full p-3 bg-gray-50"
                            placeholder="Email del Cliente"
                            name="email"
                        />
                        <ErrorMessage name='email' className='text-center my-4 bg-red-600 text-white font-bold p-3 uppercase' component="div" />
                    </div>


                    <div className='mb-4'>
                        <label 
                            htmlFor="telefono"
                            className='text-gray-800'
                        >Telefono:</label>
                        <Field
                            id="telefono"
                            type="tel"
                            className="mt-2 block w-full p-3 bg-gray-50"
                            placeholder="Telefono del Cliente"
                            name="telefono"
                        />
                        <ErrorMessage name='telefono' className='text-center my-4 bg-red-600 text-white font-bold p-3 uppercase' component="div" />
                    </div>


                    <div className='mb-4'>
                        <label 
                            htmlFor="notas"
                            className='text-gray-800'
                        >Notas:</label>
                        <Field
                            as="textarea"
                            id="notas"
                            type="text"
                            className="mt-2 block w-full p-3 bg-gray-50 h-40"
                            placeholder="Notas del Cliente"
                            name="notas"
                        />
                    </div>

                    <input
                        className='mt-5 w-full bg-blue-800 p-3 text-white uppercase font-bold text-lg' 
                        type="submit" 
                        value={cliente?.nombre ? 'Editar Cliente' : 'Agregar Cliente'}
                    />

                </Form>

                )}}

            </Formik>
        </div>
    )
  )
}

Formulario.defaultProps = {
    cliente: {},
    cargando: false
}

export default Formulario