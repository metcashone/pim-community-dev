<?php

namespace Pim\Bundle\BaseConnectorBundle\Writer\Doctrine;

use Akeneo\Bundle\BatchBundle\Entity\StepExecution;
use Akeneo\Bundle\BatchBundle\Item\AbstractConfigurableStepElement;
use Akeneo\Bundle\BatchBundle\Item\ItemWriterInterface;
use Akeneo\Bundle\BatchBundle\Step\StepExecutionAwareInterface;
use Akeneo\Component\StorageUtils\Detacher\ObjectDetacherInterface;
use Akeneo\Component\StorageUtils\Saver\BulkSaverInterface;
use Pim\Bundle\CatalogBundle\Manager\MediaManager;
use Pim\Bundle\CatalogBundle\Model\ProductInterface;
use Pim\Bundle\TransformBundle\Cache\CacheClearer;
use Pim\Bundle\VersioningBundle\Manager\VersionManager;

/**
 * Product writer using ORM method
 *
 * @author    Benoit Jacquemont <benoit@akeneo.com>
 * @copyright 2013 Akeneo SAS (http://www.akeneo.com)
 * @license   http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */
class ProductWriter extends AbstractConfigurableStepElement implements
    ItemWriterInterface,
    StepExecutionAwareInterface
{
    /**  @var MediaManager */
    protected $mediaManager;

    /** @var VersionManager */
    protected $versionManager;

    /** @var StepExecution */
    protected $stepExecution;

    /** @var boolean */
    protected $realTimeVersioning = true;

    /** @var BulkSaverInterface */
    protected $productSaver;

    /**
     * Constructor
     *
     * @param MediaManager       $mediaManager
     * @param VersionManager     $versionManager
     * @param BulkSaverInterface $productSaver
     */
    public function __construct(
        MediaManager $mediaManager,
        VersionManager $versionManager,
        BulkSaverInterface $productSaver
    ) {
        $this->mediaManager   = $mediaManager;
        $this->versionManager = $versionManager;
        $this->productSaver   = $productSaver;
    }

    /**
     * {@inheritdoc}
     */
    public function getConfigurationFields()
    {
        return [
            'realTimeVersioning' => [
                'type'    => 'switch',
                'options' => [
                    'label' => 'pim_base_connector.import.realTimeVersioning.label',
                    'help'  => 'pim_base_connector.import.realTimeVersioning.help'
                ]
            ]
        ];
    }

    /**
     * Set real time versioning
     *
     * @param boolean $realTime
     */
    public function setRealTimeVersioning($realTime)
    {
        $this->realTimeVersioning = $realTime;
    }

    /**
     * Is real time versioning
     *
     * @return boolean
     */
    public function isRealTimeVersioning()
    {
        return $this->realTimeVersioning;
    }

    /**
     * {@inheritdoc}
     */
    public function write(array $items)
    {
        $this->versionManager->setRealTimeVersioning($this->realTimeVersioning);
        foreach ($items as $item) {
            $this->incrementCount($item);
        }
        $this->mediaManager->handleAllProductsMedias($items);
        $this->productSaver->saveAll($items, ['recalculate' => false]);

        //TODO: see with @nidup if we can remove this!
        //$this->cacheClearer->clear();
    }

    /**
     * {@inheritdoc}
     */
    public function setStepExecution(StepExecution $stepExecution)
    {
        $this->stepExecution = $stepExecution;
    }

    /**
     * @param ProductInterface $product
     */
    protected function incrementCount(ProductInterface $product)
    {
        if ($product->getId()) {
            $this->stepExecution->incrementSummaryInfo('update');
        } else {
            $this->stepExecution->incrementSummaryInfo('create');
        }
    }

    /**
     * {@inheritdoc}
     */
    public function flush()
    {
//        TODO: see with @nidup if we can remove this!
//        $this->cacheClearer->clear(true);
    }
}
