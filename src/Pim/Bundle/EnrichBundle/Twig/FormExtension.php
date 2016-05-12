<?php

namespace Pim\Bundle\EnrichBundle\Twig;

use Symfony\Component\Form\FormView;

class FormExtension extends \Twig_Extension
{
    /**
     * {@inheritdoc}
     */
    public function getFunctions()
    {
       return [
           'filter_form_children' => new \Twig_Function_Method($this, 'filterFormChildren'),
       ];
    }

    /**
     * @param FormView $formType
     * @param array    $order
     *
     * @return FormView[]
     */
    public function filterFormChildren(FormView $formType, array $order)
    {
        $formTypes = $formType->children;

        $formTypes = array_filter($formTypes, function(FormView $form) use ($order) {
            return in_array($form->vars['name'], $order);
        });

        usort($formTypes, function(FormView $previousForm, FormView $form) use ($order) {
            return array_search($previousForm->vars['name'], $order) < array_search($form->vars['name'], $order) ? -1 : 1;
        });

        return $formTypes;
    }

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return 'pim_form_extension';
    }
}
