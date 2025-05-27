# Master Stack para Procesamiento de Audio/Video

Este stack maestro se encarga de orquestar el despliegue de todos los stacks del proyecto de procesamiento de audio/video con embeddings. El despliegue se realiza en orden numérico, asegurando que cada stack espere a que el anterior se complete antes de iniciar su despliegue.

## Arquitectura

El stack maestro utiliza recursos personalizados de AWS CDK para desplegar cada uno de los stacks en el siguiente orden:

1. **01-ecs-cluster**: Despliega el cluster de ECS necesario para el procesamiento de video
2. **02-aurora-pg-vector**: Configura la base de datos Aurora PostgreSQL con pgvector
3. **03-audio-video-workflow**: Implementa el flujo de trabajo principal para procesamiento de audio y video
4. **04-retrieval**: Despliega la funcionalidad de recuperación y búsqueda

## Comunicación entre Stacks

Los stacks se comunican entre sí mediante parámetros almacenados en AWS Systems Manager Parameter Store. Cada stack guarda sus outputs como parámetros SSM con el prefijo `/audio-video-embeddings/{stack-directory}/`, permitiendo que los stacks posteriores puedan acceder a esta información.

## Despliegue

Para desplegar toda la solución, simplemente ejecute:

```bash
cd 00-master-stack
cdk deploy
```

Este comando desplegará automáticamente todos los stacks en el orden correcto, manejando las dependencias y pasando los valores necesarios entre ellos.

## Eliminación

Para eliminar toda la infraestructura, ejecute:

```bash
cd 00-master-stack
cdk destroy
```

Esto eliminará todos los stacks en orden inverso, asegurando una limpieza adecuada de los recursos.
