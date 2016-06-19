import { assign, wrap } from 'lodash'
import { reflectArguments } from './reflection'

/**
 * Collection of annotation factory methods.
 * @type {Object}
 */
export const Annotations = {
  /**
   * Warning: You probably should not be referencing this annotation directly.
   * This annotation is implicitly applied when calling the {@link decorate}
   * method.
   * @see decorate
   * <p/>
   * Creates an {@code @require} annotation for electrolyte used for declaring
   * the dependencies that should be injected into the Function this annotation
   * is applied to.
   * @param  {Array.<String>} dependencies list of component names to resolve
   * dependencies.
   * @return {Object} annotation key-value-pair to assign to the target
   * function once applied.
   */
  DependsOn: (dependencies) => ({ '@require': dependencies }),
  /**
   * Denotes a component should only have one instance in the managing service
   * container.
   * @return {Object} annotation key-value-pair to assign to the target
   * function once applied.
   */
  Singleton: () => ({ '@singleton': true })
}

/**
 * Adapter function for the {@link Annoatations.DependsOn} annotation factory
 * to conform to the zero-argument contract assumed for annotation factories
 * consumed by the {@link decorate} method.
 * @param  {Array.<String>} list of component names to resolve dependencies
 * @return {Function} factory function
 */
const depsFactory = (deps) => (() => Annotations.DependsOn(deps))

/**
 * Decorates a function with provided annotations and automatically adds the
 * {@code @require} annotation by using pseudo-reflection
 * @see reflection.reflectArguments
 * @see Annoatations.Singleton
 * @param  {Function}  fn target function
 * @param  {...Function} annotationFactories zero-argument functions which
 * return an object whose key-value-pair(s) should be assigned to the
 * {@code fn}.
 * @return {Function} decorated function
 */
export const decorate = (fn, ...annotationFactories) => {
  const annotations = annotationFactories
    .concat(depsFactory(reflectArguments(fn)))
    .map(factory => factory())

  return Object.assign(fn, ...annotations)
}
