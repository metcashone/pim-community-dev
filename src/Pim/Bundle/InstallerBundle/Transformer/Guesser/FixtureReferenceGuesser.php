<?php

namespace Pim\Bundle\InstallerBundle\Transformer\Guesser;

use Doctrine\ORM\Mapping\ClassMetadataInfo;
use Pim\Bundle\ImportExportBundle\Transformer\Guesser\GuesserInterface;
use Pim\Bundle\ImportExportBundle\Transformer\Property\PropertyTransformerInterface;

/**
 * Fixture reference guesser
 *
 * @author    Antoine Guigan <antoine@akeneo.com>
 * @copyright 2013 Akeneo SAS (http://www.akeneo.com)
 * @license   http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 *
 * @author Antoine Guigan <aguigan@qimnet.com>
 */
class FixtureReferenceGuesser implements GuesserInterface
{

    /**
     * @var PropertyTransformerInterface
     */
    protected $transformer;

    /**
     * Constructor
     *
     * @param PropertyTransformerInterface $transformer
     */
    public function __construct(PropertyTransformerInterface $transformer)
    {
        $this->transformer = $transformer;
    }

    /**
     * {@inheritdoc}
     */
    public function getTransformerInfo(array $columnInfo, ClassMetadataInfo $metadata)
    {
        if (
                !$metadata->hasAssociation($columnInfo['propertyPath'])) {
            return;
        }

        $mapping = $metadata->getAssociationMapping($columnInfo['propertyPath']);

        return  array(
            $this->transformer,
            array(
                'class'    => $mapping['targetEntity'],
                'multiple'  => (ClassMetadataInfo::MANY_TO_MANY == $mapping['type'])
            )
        );
    }
}
